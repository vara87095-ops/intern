import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  AlertTriangle,
  MoreVertical,
  CheckCircle2,
  CircleDot,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';

const COLUMNS = [
  { id: 'To Do', title: 'To Do', color: 'indigo', icon: CircleDot },
  { id: 'In Progress', title: 'In Progress', color: 'amber', icon: Clock },
  { id: 'In Review', title: 'In Review', color: 'purple', icon: AlertTriangle },
  { id: 'Done', title: 'Done', color: 'emerald', icon: CheckCircle2 }
];

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange, onAddNew }) {
  // Mobile column active tab
  const [activeMobileCol, setActiveMobileCol] = useState('To Do');

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'priority-urgent';
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
      default:
        return 'priority-low';
    }
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Done') return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  const getNextStatus = (current) => {
    const map = {
      'To Do': 'In Progress',
      'In Progress': 'In Review',
      'In Review': 'Done',
      'Done': 'To Do'
    };
    return map[current] || 'In Progress';
  };

  const getPrevStatus = (current) => {
    const map = {
      'Done': 'In Review',
      'In Review': 'In Progress',
      'In Progress': 'To Do',
      'To Do': 'Done'
    };
    return map[current] || 'To Do';
  };

  return (
    <div className="kanban-wrapper">
      {/* Mobile Column Tab Navigation (<768px) */}
      <div className="mobile-col-tabs">
        {COLUMNS.map((col) => {
          const count = tasks.filter((t) => t.status === col.id).length;
          return (
            <button
              key={col.id}
              className={`mobile-tab-btn ${activeMobileCol === col.id ? 'active' : ''}`}
              onClick={() => setActiveMobileCol(col.id)}
            >
              <span>{col.title}</span>
              <span className="col-count-pill">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Container */}
      <div className="kanban-grid">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const isMobileActive = activeMobileCol === col.id;
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className={`kanban-col glass ${isMobileActive ? 'mobile-visible' : 'mobile-hidden'}`}
            >
              <div className="kanban-col-header">
                <div className="col-header-title">
                  <div className={`col-indicator col-${col.color}`} />
                  <Icon size={18} className={`text-${col.color}`} />
                  <span className="col-name">{col.title}</span>
                  <span className="col-badge">{colTasks.length}</span>
                </div>
                <button
                  className="btn-icon add-in-col-btn"
                  onClick={() => onAddNew(col.id)}
                  title={`Add task to ${col.title}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="kanban-card-list">
                {colTasks.length === 0 ? (
                  <div className="empty-col-state">
                    <p>No tasks in {col.title}</p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onAddNew(col.id)}
                    >
                      + Add Task
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const overdue = isOverdue(task.dueDate, task.status);
                    return (
                      <div key={task.id} className="kanban-card glass">
                        <div className="card-top-row">
                          <span className={`priority-pill ${getPriorityClass(task.priority)}`}>
                            {task.priority === 'Urgent' && '🔥 '}
                            {task.priority}
                          </span>

                          <div className="card-actions">
                            <button
                              className="btn-icon-subtle"
                              onClick={() => onEdit(task)}
                              title="Edit Task"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn-icon-subtle delete-action"
                              onClick={() => onDelete(task.id)}
                              title="Delete Task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <h4 className="card-title">{task.title}</h4>

                        {task.description && (
                          <p className="card-desc">{task.description}</p>
                        )}

                        {Array.isArray(task.tags) && task.tags.length > 0 && (
                          <div className="card-tags">
                            {task.tags.map((tag) => (
                              <span key={tag} className="card-tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="card-footer">
                          {task.dueDate ? (
                            <div className={`due-date ${overdue ? 'overdue' : ''}`}>
                              <Calendar size={13} />
                              <span>{task.dueDate}</span>
                            </div>
                          ) : (
                            <div />
                          )}

                          <div
                            className="assignee-avatar"
                            title={`Assigned to: ${task.assignedTo?.name || 'Unassigned'}`}
                          >
                            {task.assignedTo?.avatar || (task.assignedTo?.name ? task.assignedTo.name.substring(0, 2).toUpperCase() : '??')}
                          </div>
                        </div>

                        {/* Quick Status Transition Bar */}
                        <div className="card-quick-move">
                          {col.id !== 'To Do' && (
                            <button
                              className="move-btn move-prev"
                              onClick={() => onStatusChange(task.id, getPrevStatus(col.id))}
                              title={`Move back to ${getPrevStatus(col.id)}`}
                            >
                              <ArrowLeft size={12} />
                              <span>{getPrevStatus(col.id)}</span>
                            </button>
                          )}
                          {col.id !== 'Done' && (
                            <button
                              className="move-btn move-next"
                              onClick={() => onStatusChange(task.id, getNextStatus(col.id))}
                              title={`Advance to ${getNextStatus(col.id)}`}
                            >
                              <span>{getNextStatus(col.id)}</span>
                              <ArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
