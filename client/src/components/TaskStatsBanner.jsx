import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export function TaskStatsBanner({ stats }) {
  if (!stats) return null;

  const total = stats.totalTasks || 0;
  const inProgress = (stats.byStatus?.['In Progress'] || 0) + (stats.byStatus?.['In Review'] || 0);
  const done = stats.byStatus?.Done || 0;
  const overdue = stats.overdueCount || 0;
  const rate = stats.completionRate || 0;

  return (
    <div className="task-stats-banner">
      <div className="stat-card glass">
        <div className="stat-header">
          <span className="stat-label">Total Tasks</span>
          <Layers size={18} className="text-primary" />
        </div>
        <div className="stat-value">{total}</div>
        <span className="stat-sub">Active in sprint</span>
      </div>

      <div className="stat-card glass">
        <div className="stat-header">
          <span className="stat-label">In Flight</span>
          <Clock size={18} className="text-warning" />
        </div>
        <div className="stat-value text-warning">{inProgress}</div>
        <span className="stat-sub">In progress & review</span>
      </div>

      <div className="stat-card glass">
        <div className="stat-header">
          <span className="stat-label">Completed</span>
          <CheckCircle2 size={18} className="text-success" />
        </div>
        <div className="stat-value text-success">{done}</div>
        <span className="stat-sub">{rate}% completion rate</span>
      </div>

      <div className="stat-card glass">
        <div className="stat-header">
          <span className="stat-label">Overdue</span>
          <AlertTriangle size={18} className="text-danger" />
        </div>
        <div className={`stat-value ${overdue > 0 ? 'text-danger' : ''}`}>{overdue}</div>
        <span className="stat-sub">Past target date</span>
      </div>

      <div className="stat-card glass progress-stat-card">
        <div className="stat-header">
          <span className="stat-label">Sprint Velocity</span>
          <TrendingUp size={18} className="text-accent" />
        </div>
        <div className="stat-value">{rate}%</div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${rate}%` }} />
        </div>
      </div>
    </div>
  );
}
