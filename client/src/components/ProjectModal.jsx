import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function ProjectModal({ isOpen, onClose, onSave, projectToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Full Stack',
    status: 'In Progress',
    techStack: '',
    repoUrl: '',
    liveUrl: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        category: projectToEdit.category || 'Full Stack',
        status: projectToEdit.status || 'In Progress',
        techStack: Array.isArray(projectToEdit.techStack)
          ? projectToEdit.techStack.join(', ')
          : '',
        repoUrl: projectToEdit.repoUrl || '',
        liveUrl: projectToEdit.liveUrl || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Full Stack',
        status: 'In Progress',
        techStack: '',
        repoUrl: '',
        liveUrl: ''
      });
    }
    setError('');
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a project title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a project description');
      return;
    }
    if (!formData.techStack.trim()) {
      setError('Please provide at least one technology (e.g. React, Node.js)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        ...formData,
        techStack: formData.techStack.split(',').map((t) => t.trim()).filter(Boolean)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {projectToEdit ? 'Edit Project Details' : 'Add New Project'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Real-Time Chat Application"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the problem solved, core features, and architectural highlights..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Cloud">Cloud</option>
                <option value="IoT">IoT</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Technologies (comma separated) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/..."
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Live Demo URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : projectToEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
