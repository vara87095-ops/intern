import React from 'react';
import { Calendar, Edit2, Trash2, Tag, User } from 'lucide-react';

export function TaskListView({ tasks, onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state glass">
        <h3>No tasks match your filter</h3>
        <p>Try modifying your search or click "+ New Task" to add one.</p>
      </div>
    );
  }

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

  return (
    <div className="task-list-container glass">
      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Task Title</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assignee</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="task-table-row">
                <td className="status-col">
                  <select
                    className="inline-status-select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                  >
                    <option value="To Do">📋 To Do</option>
                    <option value="In Progress">⚡ In Progress</option>
                    <option value="In Review">🔍 In Review</option>
                    <option value="Done">✅ Done</option>
                  </select>
                </td>
                <td className="title-col">
                  <div className="list-title">{task.title}</div>
                  {task.description && (
                    <div className="list-desc">{task.description}</div>
                  )}
                  {Array.isArray(task.tags) && task.tags.length > 0 && (
                    <div className="list-tags">
                      {task.tags.map((t) => (
                        <span key={t} className="list-tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`priority-pill ${getPriorityClass(task.priority)}`}>
                    {task.priority === 'Urgent' && '🔥 '}
                    {task.priority}
                  </span>
                </td>
                <td>
                  {task.dueDate ? (
                    <div className="list-date">
                      <Calendar size={13} />
                      <span>{task.dueDate}</span>
                    </div>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  <div className="list-assignee">
                    <div className="assignee-avatar avatar-sm">
                      {task.assignedTo?.avatar || (task.assignedTo?.name ? task.assignedTo.name.substring(0, 2).toUpperCase() : '??')}
                    </div>
                    <span>{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="text-right">
                  <div className="list-actions">
                    <button
                      className="btn-icon-subtle"
                      onClick={() => onEdit(task)}
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="btn-icon-subtle delete-action"
                      onClick={() => onDelete(task.id)}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
