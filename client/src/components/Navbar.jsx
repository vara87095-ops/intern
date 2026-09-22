import React from 'react';
import { Layers, Plus, Database, Activity } from 'lucide-react';

export function Navbar({ onOpenAddModal, healthStatus }) {
  const isOnline = healthStatus?.status === 'healthy';
  const dbType = healthStatus?.database?.type || 'Connecting...';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a href="#" className="brand">
          <div className="brand-icon">
            <Layers size={22} />
          </div>
          <div>
            <span className="brand-title">ProjectHub</span>
          </div>
        </a>

        <div className="nav-actions">
          <div className="status-badge" title={`Database: ${dbType}`}>
            <Database size={14} style={{ color: 'var(--accent)' }} />
            <span>{dbType}</span>
            <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
          </div>

          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
