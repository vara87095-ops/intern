import React from 'react';
import { FolderGit2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export function StatsBanner({ stats }) {
  const total = stats?.totalProjects || 0;
  const completed = stats?.byStatus?.Completed || 0;
  const inProgress = stats?.byStatus?.['In Progress'] || 0;
  const topTech = stats?.topTechnologies?.[0]?.name || 'React';

  return (
    <div className="stats-banner">
      <div className="glass stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Projects</span>
          <FolderGit2 size={20} style={{ color: 'var(--primary)' }} />
        </div>
        <div className="stat-value">{total}</div>
        <span className="stat-label">Showcased & Managed</span>
      </div>

      <div className="glass stat-card">
        <div className="stat-header">
          <span className="stat-label">Completed</span>
          <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
        </div>
        <div className="stat-value" style={{ color: 'var(--success)' }}>{completed}</div>
        <span className="stat-label">Deployed & Production Ready</span>
      </div>

      <div className="glass stat-card">
        <div className="stat-header">
          <span className="stat-label">In Progress</span>
          <Clock size={20} style={{ color: 'var(--warning)' }} />
        </div>
        <div className="stat-value" style={{ color: 'var(--warning)' }}>{inProgress}</div>
        <span className="stat-label">Active Development</span>
      </div>

      <div className="glass stat-card">
        <div className="stat-header">
          <span className="stat-label">Top Technology</span>
          <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
        </div>
        <div className="stat-value" style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>
          {topTech}
        </div>
        <span className="stat-label">Most Used in Projects</span>
      </div>
    </div>
  );
}
