import React from 'react';
import { Search, LayoutGrid, List, Plus, Layers, Filter } from 'lucide-react';

export function TaskFilterBar({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  activeView,
  setActiveView,
  onAddNewTask
}) {
  return (
    <div className="task-controls-bar">
      {/* Search and filters */}
      <div className="filter-group-left">
        <div className="search-box glass">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title, tag, assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>
              ×
            </button>
          )}
        </div>

        <div className="select-filters">
          <div className="filter-select-wrapper">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="All">All Priorities</option>
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Switcher and Action Button */}
      <div className="filter-group-right">
        <div className="view-toggle-group glass">
          <button
            className={`view-toggle-btn ${activeView === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveView('kanban')}
            title="Kanban Board View"
          >
            <LayoutGrid size={16} />
            <span className="view-toggle-label">Board</span>
          </button>
          <button
            className={`view-toggle-btn ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
            title="Task List View"
          >
            <List size={16} />
            <span className="view-toggle-label">List</span>
          </button>
          <button
            className={`view-toggle-btn ${activeView === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveView('projects')}
            title="Project Showcase View"
          >
            <Layers size={16} />
            <span className="view-toggle-label">Projects</span>
          </button>
        </div>

        {activeView !== 'projects' && (
          <button className="btn btn-primary new-task-btn" onClick={onAddNewTask}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        )}
      </div>
    </div>
  );
}
