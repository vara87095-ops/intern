import React from 'react';
import { ExternalLink, Github, Edit3, Trash2, Globe } from 'lucide-react';

export function ProjectCard({ project, onEdit, onDelete }) {
  const statusClass = project.status ? project.status.replace(/\s+/g, '') : 'InProgress';

  return (
    <div className="glass project-card">
      <div>
        <div className="card-top">
          <span className="category-tag">{project.category}</span>
          <span className={`status-tag ${statusClass}`}>{project.status}</span>
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        <div className="tech-tags">
          {Array.isArray(project.techStack) &&
            project.techStack.map((tech, idx) => (
              <span key={idx} className="tech-pill">
                {tech}
              </span>
            ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="card-links">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="link-btn"
              title="View Repository"
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="link-btn"
              title="View Live Demo"
              style={{ color: 'var(--accent)' }}
            >
              <Globe size={16} />
              <span>Live</span>
            </a>
          )}
        </div>

        <div className="card-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(project)}
            title="Edit Project"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="btn-icon"
            onClick={() => onDelete(project.id)}
            title="Delete Project"
            style={{ color: '#f87171' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
