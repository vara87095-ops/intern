import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Shield, Zap, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register, quickDemoLogin } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, role });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(demoRole);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="modal-subtitle">
              {mode === 'login'
                ? 'Sign in with JWT authentication to manage tasks'
                : 'Join the team to collaborate with real-time updates'}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="demo-login-box">
          <div className="demo-login-header">
            <Zap size={14} className="text-warning" />
            <span>Instant Demo Logins (No typing needed)</span>
          </div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="btn btn-secondary demo-btn"
              onClick={() => handleDemo('admin')}
              disabled={loading}
            >
              👑 Demo Admin (Alex)
            </button>
            <button
              type="button"
              className="btn btn-secondary demo-btn"
              onClick={() => handleDemo('member')}
              disabled={loading}
            >
              👩‍💻 Demo Member (Sarah)
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-box error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Assign Role</label>
              <div className="input-with-icon">
                <Shield size={18} className="input-icon" />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="member">Team Member</option>
                  <option value="admin">Project Admin</option>
                </select>
              </div>
            </div>
          )}

          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
