import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TaskStatsBanner } from './components/TaskStatsBanner';
import { TaskFilterBar } from './components/TaskFilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { TaskModal } from './components/TaskModal';
import { AuthModal } from './components/AuthModal';
import { LearningModal } from './components/LearningModal';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { useAuth } from './context/AuthContext';
import { useSocket } from './context/SocketContext';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getProjects,
  getStats,
  getHealth,
  createProject,
  updateProject,
  deleteProject
} from './services/api';
import {
  Layers,
  AlertCircle,
  RefreshCw,
  Plus,
  Radio,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected, realtimeAlert, clearAlert } = useSocket();

  // Active view: 'kanban' | 'list' | 'projects'
  const [activeView, setActiveView] = useState('kanban');

  // --- Task State ---
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  // Task Filters
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatus, setTaskStatus] = useState('All');
  const [taskPriority, setTaskPriority] = useState('All');

  // --- Project State (Showcase mode) ---
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategory, setProjectCategory] = useState('All');
  const [projectStatus, setProjectStatus] = useState('All');

  // Backend Health
  const [health, setHealth] = useState(null);

  // --- Modals ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLearningModalOpen, setIsLearningModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // --- Local Toast Notification ---
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Fetch Tasks
  const loadTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      setTasksError(null);
      const [res, statsRes] = await Promise.all([
        getTasks({
          search: taskSearch,
          status: taskStatus,
          priority: taskPriority
        }),
        getTaskStats().catch(() => null)
      ]);
      setTasks(res.data || []);
      if (statsRes) setTaskStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setTasksError(err.message || 'Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  }, [taskSearch, taskStatus, taskPriority]);

  // 2. Fetch Projects & Health
  const loadProjects = useCallback(async () => {
    try {
      const [projRes, statsRes, healthRes] = await Promise.all([
        getProjects({
          search: projectSearch,
          category: projectCategory,
          status: projectStatus
        }),
        getStats().catch(() => null),
        getHealth().catch(() => ({ status: 'offline' }))
      ]);
      setProjects(projRes.data || []);
      if (statsRes) setProjectStats(statsRes.data);
      if (healthRes) setHealth(healthRes);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  }, [projectSearch, projectCategory, projectStatus]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Periodic Health check
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const h = await getHealth();
        setHealth(h);
      } catch {
        setHealth({ status: 'offline' });
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // 3. Real-Time WebSocket Synchronization Event Handlers
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (data) => {
      setTasks((prev) => {
        if (prev.some((t) => t.id === data.task.id)) return prev;
        return [data.task, ...prev];
      });
      getTaskStats().then((s) => s?.data && setTaskStats(s.data)).catch(() => {});
    };

    const handleTaskUpdated = (data) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === data.task.id ? data.task : t))
      );
      getTaskStats().then((s) => s?.data && setTaskStats(s.data)).catch(() => {});
    };

    const handleTaskDeleted = (data) => {
      setTasks((prev) => prev.filter((t) => t.id !== data.id));
      getTaskStats().then((s) => s?.data && setTaskStats(s.data)).catch(() => {});
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket]);

  // --- Task CRUD Action Handlers ---
  const handleOpenAddTask = (defaultStatus = 'To Do') => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in or use 1-click Demo Login to create tasks', 'info');
      return;
    }
    setTaskToEdit({ status: defaultStatus });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to edit tasks', 'info');
      return;
    }
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskPayload) => {
    if (taskToEdit && taskToEdit.id) {
      await updateTask(taskToEdit.id, taskPayload);
      showToast('Task updated successfully! ⚡');
    } else {
      await createTask(taskPayload);
      showToast('New task broadcast to team in real-time! 🚀');
    }
    loadTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to update task progress', 'info');
      return;
    }
    try {
      // Optimistic local update for instant snappy feedback
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await updateTaskStatus(taskId, newStatus);
      showToast(`Task moved to ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      loadTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      showToast('Please sign in to delete tasks', 'info');
      return;
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        await deleteTask(taskId);
        showToast('Task deleted successfully');
      } catch (err) {
        showToast(err.message || 'Failed to delete task', 'error');
        loadTasks();
      }
    }
  };

  // --- Project CRUD Handlers (Showcase View) ---
  const handleSaveProject = async (formData) => {
    if (projectToEdit) {
      await updateProject(projectToEdit.id, formData);
      showToast('Project updated successfully! 🎉');
    } else {
      await createProject(formData);
      showToast('New project created and stored in database! 🚀');
    }
    loadProjects();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        showToast('Project deleted successfully');
        loadProjects();
      } catch (err) {
        showToast(err.message || 'Failed to delete project', 'error');
      }
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenLearningModal={() => setIsLearningModalOpen(true)}
        onOpenTaskModal={() => handleOpenAddTask('To Do')}
        healthStatus={health}
      />

      {/* Global Real-Time WebSocket Toast Alert Banner */}
      {realtimeAlert && (
        <div className="realtime-banner glass">
          <div className="rb-content">
            <Radio size={16} className="text-accent pulse-icon" />
            <span>{realtimeAlert.message}</span>
          </div>
          <button className="btn-icon-subtle" onClick={clearAlert} aria-label="Close notification">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Local Action Toast */}
      {toast && (
        <div className={`toast-notification glass ${toast.type}`}>
          <div className="toast-content">
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
          <button className="btn-icon-subtle" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="container main-content">
        {/* Sprint / Tasks View */}
        {activeView !== 'projects' ? (
          <div className="tasks-view-section">
            {/* Header Hero */}
            <div className="view-hero-header">
              <div>
                <h1 className="hero-title">
                  Real-Time <span className="gradient-text">Sprint Board</span>
                </h1>
                <p className="hero-subtitle">
                  Full-stack task coordination with JWT authorization, live WebSockets, and instant status progression.
                </p>
              </div>

              {!isAuthenticated && (
                <div className="guest-banner glass">
                  <div className="guest-banner-text">
                    <Sparkles size={16} className="text-warning" />
                    <span>Viewing as Guest. Sign in or use 1-click Demo Login to create and edit tasks.</span>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    1-Click Demo Login
                  </button>
                </div>
              )}
            </div>

            {/* Task Sprint Statistics Banner */}
            <TaskStatsBanner stats={taskStats} />

            {/* Search, Filter & View Controls */}
            <TaskFilterBar
              search={taskSearch}
              setSearch={setTaskSearch}
              status={taskStatus}
              setStatus={setTaskStatus}
              priority={taskPriority}
              setPriority={setTaskPriority}
              activeView={activeView}
              setActiveView={setActiveView}
              onAddNewTask={() => handleOpenAddTask('To Do')}
            />

            {/* Error Message */}
            {tasksError && (
              <div className="alert-box error" style={{ margin: '1.5rem 0' }}>
                <AlertCircle size={20} />
                <span>{tasksError}</span>
                <button className="btn btn-secondary btn-sm" onClick={loadTasks}>
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            )}

            {/* Task View Rendering: Kanban or List */}
            {tasksLoading && tasks.length === 0 ? (
              <div className="loading-state glass">
                <RefreshCw size={28} className="spin-icon" />
                <p>Loading real-time sprint data...</p>
              </div>
            ) : activeView === 'kanban' ? (
              <KanbanBoard
                tasks={tasks}
                onEdit={handleOpenEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onAddNew={(colStatus) => handleOpenAddTask(colStatus)}
              />
            ) : (
              <TaskListView
                tasks={tasks}
                onEdit={handleOpenEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        ) : (
          /* Project Showcase View (Preserves existing ProjectHub showcase) */
          <div className="projects-view-section">
            <div className="view-hero-header">
              <div>
                <h1 className="hero-title">
                  Project <span className="gradient-text">Showcase</span>
                </h1>
                <p className="hero-subtitle">
                  Full-stack portfolio showcase and project management hub.
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setProjectToEdit(null);
                  setIsProjectModalOpen(true);
                }}
              >
                <Plus size={18} />
                <span>New Project</span>
              </button>
            </div>

            <StatsBanner stats={projectStats} />

            <FilterBar
              search={projectSearch}
              setSearch={setProjectSearch}
              category={projectCategory}
              setCategory={setProjectCategory}
              status={projectStatus}
              setStatus={setProjectStatus}
            />

            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={(p) => {
                    setProjectToEdit(p);
                    setIsProjectModalOpen(true);
                  }}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <button
        className="mobile-fab"
        onClick={() => handleOpenAddTask('To Do')}
        aria-label="Create new task"
      >
        <Plus size={24} />
      </button>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <LearningModal
        isOpen={isLearningModalOpen}
        onClose={() => setIsLearningModalOpen(false)}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>
            TaskFlow & ProjectHub • Full-Stack Application with JWT Authentication, Task CRUD & WebSockets
          </p>
          <button
            className="footer-guide-link"
            onClick={() => setIsLearningModalOpen(true)}
          >
            📖 Open Full-Stack Architecture Guide
          </button>
        </div>
      </footer>
    </div>
  );
}
