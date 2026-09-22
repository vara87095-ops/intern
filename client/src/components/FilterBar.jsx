import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI/ML', 'Cloud', 'IoT'];

export function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange
}) {
  return (
    <div className="controls-bar">
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description, or technology..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill ${category === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Planned">Planned</option>
        </select>
      </div>
    </div>
  );
}
