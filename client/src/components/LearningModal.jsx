import React, { useState } from 'react';
import { X, BookOpen, Layers, Shield, Radio, Code2, Cpu, CheckCircle2 } from 'lucide-react';

export function LearningModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('structure');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass learning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="learning-title-group">
            <div className="learning-icon-box">
              <BookOpen size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="modal-title">Full-Stack Architecture & Concepts Guide</h2>
              <p className="modal-subtitle">
                Interactive learning breakdown: Architecture, JWT Auth, WebSockets & Dynamic Data
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="learning-tabs">
          <button
            className={`learning-tab ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            <Layers size={16} />
            <span>1. Architecture</span>
          </button>
          <button
            className={`learning-tab ${activeTab === 'auth' ? 'active' : ''}`}
            onClick={() => setActiveTab('auth')}
          >
            <Shield size={16} />
            <span>2. Auth & RBAC</span>
          </button>
          <button
            className={`learning-tab ${activeTab === 'realtime' ? 'active' : ''}`}
            onClick={() => setActiveTab('realtime')}
          >
            <Radio size={16} />
            <span>3. WebSockets</span>
          </button>
          <button
            className={`learning-tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Code2 size={16} />
            <span>4. API & Data Flow</span>
          </button>
        </div>

        <div className="learning-content-body">
          {activeTab === 'structure' && (
            <div className="learning-pane">
              <h3>🏗️ Full-Stack Application Structure</h3>
              <p>
                This project demonstrates a production-grade <strong>client-server monorepo</strong> architecture with clean separation of concerns:
              </p>

              <div className="learning-cards-grid">
                <div className="learning-card glass">
                  <div className="lc-header">
                    <span className="badge-pill">Frontend</span>
                    <h4>React 18 + Vite</h4>
                  </div>
                  <ul>
                    <li><strong>Context API:</strong> Global <code>AuthContext</code> & <code>SocketContext</code>.</li>
                    <li><strong>Responsive Views:</strong> Kanban Board, Dense List View, and Portfolio Showcase.</li>
                    <li><strong>API Service Layer:</strong> Centralized fetch wrappers with automated JWT injection.</li>
                  </ul>
                </div>

                <div className="learning-card glass">
                  <div className="lc-header">
                    <span className="badge-pill">Backend</span>
                    <h4>Node.js + Express + Socket.io</h4>
                  </div>
                  <ul>
                    <li><strong>MVC Layout:</strong> Models, Controllers, Routes, and Middleware.</li>
                    <li><strong>WebSockets:</strong> Bi-directional event broadcasting via <code>socket.io</code>.</li>
                    <li><strong>Security:</strong> CORS, environment configs, and token expiration.</li>
                  </ul>
                </div>

                <div className="learning-card glass">
                  <div className="lc-header">
                    <span className="badge-pill">Database</span>
                    <h4>Dual Persistent Adapter</h4>
                  </div>
                  <ul>
                    <li><strong>MongoDB Atlas:</strong> Activated when <code>MONGODB_URI</code> is supplied.</li>
                    <li><strong>Zero-Config Local JSON Store:</strong> Fallback persistent file storage so anyone can clone and run instantly.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="learning-pane">
              <h3>🔐 Authentication & Role-Based Authorization</h3>
              <p>
                How modern stateless authentication works across the HTTP lifecycle:
              </p>

              <div className="learning-step-flow">
                <div className="step-box glass">
                  <span className="step-num">1</span>
                  <h5>Registration & Hashing</h5>
                  <p>Passwords are salted and securely hashed using <code>bcryptjs</code> (10 rounds) before hitting the database. Plain passwords never touch storage.</p>
                </div>

                <div className="step-box glass">
                  <span className="step-num">2</span>
                  <h5>JWT Generation</h5>
                  <p>Upon successful authentication, the server generates a signed JSON Web Token (<code>jwt.sign</code>) carrying user ID and expiration (7 days).</p>
                </div>

                <div className="step-box glass">
                  <span className="step-num">3</span>
                  <h5>Bearer Header Injection</h5>
                  <p>The client stores the token in <code>localStorage</code> and attaches it as an <code>Authorization: Bearer &lt;token&gt;</code> header on mutation requests.</p>
                </div>

                <div className="step-box glass">
                  <span className="step-num">4</span>
                  <h5>Protect & Authorize Middleware</h5>
                  <p>Express middleware decodes the token with <code>jwt.verify</code>, attaches <code>req.user</code>, and enforces RBAC roles (<code>member</code> vs <code>admin</code>).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'realtime' && (
            <div className="learning-pane">
              <h3>⚡ Real-Time Synchronization via WebSockets</h3>
              <p>
                Traditional REST APIs require manual page refreshes or polling to see new data. WebSockets provide persistent bi-directional communication channels:
              </p>

              <div className="code-explainer glass">
                <div className="explainer-item">
                  <span className="event-badge badge-blue">task:created</span>
                  <p>When user A adds a task, the REST controller calls <code>emitTaskCreated(task, actor)</code>. All connected clients receive the event and append the task to their state in under 50ms.</p>
                </div>

                <div className="explainer-item">
                  <span className="event-badge badge-amber">task:updated</span>
                  <p>When a task moves from "To Do" to "In Progress" or is edited, <code>task:updated</code> updates the card position across all screens simultaneously.</p>
                </div>

                <div className="explainer-item">
                  <span className="event-badge badge-purple">users:count</span>
                  <p>Active WebSocket connection count is broadcasted on connect/disconnect to provide live presence indicators.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="learning-pane">
              <h3>📊 Dynamic Data Handling & API Integration</h3>
              <p>
                Techniques implemented to ensure fluid performance and user feedback:
              </p>

              <div className="learning-checklist">
                <div className="check-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <strong>Optimistic & Reactive Updates:</strong> Real-time socket events seamlessly merge with locally cached state, eliminating loading spinners for teammates.
                  </div>
                </div>

                <div className="check-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <strong>Multi-Parameter Filtering:</strong> The backend accepts combined filters (<code>search</code>, <code>status</code>, <code>priority</code>, <code>sortBy</code>) for fast query processing.
                  </div>
                </div>

                <div className="check-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <strong>Sprint Metrics Aggregation:</strong> Endpoints like <code>/api/tasks/stats</code> calculate real-time completion rates and overdue counts dynamically.
                  </div>
                </div>

                <div className="check-item">
                  <CheckCircle2 size={18} className="text-success" />
                  <div>
                    <strong>Mobile-First Responsive Layout:</strong> Adaptive flex/grid system, touch-friendly tap targets, and mobile column tabs for phone screens.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
