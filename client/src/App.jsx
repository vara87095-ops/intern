import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import {
  getProjects,
  getStats,
  getHealth,
  createProject,
  updateProject,
  deleteProject
} from './services/api';
import { Layers, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Parallel data fetching
      const [projRes, statsRes, healthRes] = await Promise.all([
        getProjects({ search, category, status }),
        getStats().catch(() => null),
        getHealth().catch(() => ({ status: 'offline' }))
      ]);

      setProjects(projRes.data || []);
      if (statsRes) setStats(statsRes.data);
      if (healthRes) setHealth(healthRes);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load projects from server.');
    } finally {
      setLoading(false);
    }
  }, [search, category, status]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const h = await getHealth();
        setHealth(h);
      } catch {
        setHealth({ status: 'offline' });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (formData) => {
    if (projectToEdit) {
      await updateProject(projectToEdit.id, formData);
      showToast('Project updated successfully! 🎉');
    } else {
      await createProject(formData);
      showToast('New project created and stored in database! 🚀');
    }
    loadData();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        showToast('Project deleted successfully.', 'info');
        loadData();
      } catch (err) {
        showToast(err.message || 'Failed to delete project', 'error');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAddModal={handleOpenAddModal} healthStatus={health} />

      {/* Floating Notification Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            padding: '1rem 1.4rem',
            borderRadius: '12px',
            background: toast.type === 'error' ? '#ef4444' : '#10b981',
            color: '#fff',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {toast.message}
        </div>
      )}

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        <StatsBanner stats={stats} />

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
        />

        {error ? (
          <div className="glass state-container" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <AlertCircle size={40} style={{ color: '#ef4444', marginBottom: '1rem' }} />
            <h3 className="state-title" style={{ color: '#ef4444' }}>
              Connection Error
            </h3>
            <p className="state-desc">{error}</p>
            <button className="btn btn-secondary" onClick={loadData}>
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        ) : loading ? (
          <div className="glass state-container">
            <div className="spinner" />
            <h3 className="state-title">Loading Projects...</h3>
            <p className="state-desc">Fetching project details from backend API & database</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="glass state-container">
            <Layers size={44} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 className="state-title">No Projects Found</h3>
            <p className="state-desc">
              {search || category !== 'All' || status !== 'All'
                ? 'Try adjusting your search query or filters to find what you are looking for.'
                : 'Get started by creating and showcasing your first project!'}
            </p>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '1.5rem 0',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <div className="container">
          <p>
            ProjectHub &bull; Full-Stack Live Project &bull; Integrated Frontend, Backend & Database
          </p>
        </div>
      </footer>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />
    </div>
  );
}
