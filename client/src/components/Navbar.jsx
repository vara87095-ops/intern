import React, { useState } from 'react';
import {
  Layers,
  Database,
  Radio,
  BookOpen,
  LogOut,
  User,
  Menu,
  X,
  LayoutGrid,
  List,
  Shield,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export function Navbar({
  activeView,
  setActiveView,
  onOpenAuthModal,
  onOpenLearningModal,
  onOpenTaskModal,
  healthStatus
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isConnected, onlineCount } = useSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDbOnline = healthStatus?.status === 'healthy';
  const dbType = healthStatus?.database?.type || 'Local JSON Store';

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          {/* Brand */}
          <div className="brand-group">
            <a href="#" className="brand" onClick={(e) => { e.preventDefault(); setActiveView('kanban'); }}>
              <div className="brand-icon">
                <Layers size={22} />
              </div>
              <div className="brand-text">
                <span className="brand-title">TaskFlow</span>
                <span className="brand-sub">Full-Stack Hub</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-desktop-links">
            <button
              className={`nav-link ${activeView === 'kanban' ? 'active' : ''}`}
              onClick={() => setActiveView('kanban')}
            >
              <LayoutGrid size={15} />
              <span>Kanban Board</span>
            </button>
            <button
              className={`nav-link ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
            >
              <List size={15} />
              <span>Task List</span>
            </button>
            <button
              className={`nav-link ${activeView === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveView('projects')}
            >
              <Layers size={15} />
              <span>Projects</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="nav-actions">
            {/* Real-time WebSocket Status Pill */}
            <div
              className={`status-badge socket-badge ${isConnected ? 'socket-connected' : 'socket-disconnected'}`}
              title={isConnected ? `WebSocket Connected: ${onlineCount} online client(s)` : 'WebSocket Connecting...'}
            >
              <Radio size={13} className={isConnected ? 'pulse-icon' : ''} />
              <span className="realtime-text">
                {isConnected ? `Real-Time (${onlineCount})` : 'Offline'}
              </span>
              <span className={`status-indicator ${isConnected ? 'online' : 'offline'}`} />
            </div>

            {/* Architecture Guide Button */}
            <button
              className="btn btn-secondary guide-btn"
              onClick={onOpenLearningModal}
              title="Learn Full-Stack Architecture & Data Flow"
            >
              <BookOpen size={16} />
              <span className="guide-btn-text">Architecture Guide</span>
            </button>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="user-profile-menu">
                <div className="user-pill glass">
                  <div className="user-avatar-small">
                    {user?.avatar || user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="user-info-text">
                    <span className="user-name-label">{user?.name}</span>
                    <span className="user-role-badge">
                      {user?.role === 'admin' && <Shield size={10} />}
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-icon logout-btn"
                  onClick={logout}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary sign-in-btn" onClick={onOpenAuthModal}>
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="btn-icon mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="drawer-title">Navigation</span>
              <button className="btn-icon" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <button
                className={`drawer-link ${activeView === 'kanban' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('kanban');
                  setMobileMenuOpen(false);
                }}
              >
                <LayoutGrid size={18} />
                <span>Kanban Board</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'list' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('list');
                  setMobileMenuOpen(false);
                }}
              >
                <List size={18} />
                <span>Task List</span>
              </button>

              <button
                className={`drawer-link ${activeView === 'projects' ? 'active' : ''}`}
                onClick={() => {
                  setActiveView('projects');
                  setMobileMenuOpen(false);
                }}
              >
                <Layers size={18} />
                <span>Projects Showcase</span>
              </button>

              <button
                className="drawer-link"
                onClick={() => {
                  onOpenLearningModal();
                  setMobileMenuOpen(false);
                }}
              >
                <BookOpen size={18} />
                <span>Architecture & Learning Guide</span>
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <div className="drawer-db-status">
                <Database size={14} />
                <span>DB: {dbType}</span>
                <span className={`status-indicator ${isDbOnline ? 'online' : 'offline'}`} />
              </div>

              {isAuthenticated ? (
                <div className="drawer-user-card glass">
                  <div className="user-avatar-small">
                    {user?.avatar || user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div className="drawer-user-info">
                    <span className="drawer-name">{user?.name}</span>
                    <span className="drawer-email">{user?.email}</span>
                  </div>
                  <button className="btn-icon" onClick={logout} title="Sign Out">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary full-width"
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                >
                  <User size={16} />
                  <span>Sign In / Demo Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
