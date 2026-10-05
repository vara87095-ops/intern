const API_ROOT = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ==========================================
// 1. AUTHENTICATION & USER MANAGEMENT
// ==========================================

export async function loginUser(email, password) {
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser({ name, email, password, role }) {
  const res = await fetch(`${API_ROOT}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const res = await fetch(`${API_ROOT}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  const data = await res.json();
  return data.user;
}

export async function getTeamMembers() {
  const res = await fetch(`${API_ROOT}/auth/users`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.data || [];
}

// ==========================================
// 2. TASK CRUD OPERATIONS
// ==========================================

export async function getTasks(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
  if (params.assignedTo && params.assignedTo !== 'All') query.append('assignedTo', params.assignedTo);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.order) query.append('order', params.order);

  const url = `${API_ROOT}/tasks${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch tasks (${res.status})`);
  }
  return res.json();
}

export async function getTaskById(id) {
  const res = await fetch(`${API_ROOT}/tasks/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch task ${id}`);
  }
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_ROOT}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create task');
  }
  return data;
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${API_ROOT}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update task');
  }
  return data;
}

export async function updateTaskStatus(id, status) {
  const res = await fetch(`${API_ROOT}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update task status');
  }
  return data;
}

export async function deleteTask(id) {
  const res = await fetch(`${API_ROOT}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete task');
  }
  return data;
}

export async function getTaskStats() {
  const res = await fetch(`${API_ROOT}/tasks/stats`, { headers: getAuthHeaders() });
  if (!res.ok) {
    throw new Error('Failed to fetch task statistics');
  }
  return res.json();
}

// ==========================================
// 3. PROJECT CRUD OPERATIONS & HEALTH
// ==========================================

export async function getProjects(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.order) query.append('order', params.order);

  const url = `${API_ROOT}/projects${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch projects (${res.status})`);
  }
  return res.json();
}

export async function getProjectById(id) {
  const res = await fetch(`${API_ROOT}/projects/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch project ${id}`);
  }
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_ROOT}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create project');
  }
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${API_ROOT}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_ROOT}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete project');
  }
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_ROOT}/projects/stats`);
  if (!res.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return res.json();
}

export async function getHealth() {
  const res = await fetch(`${API_ROOT}/projects/health`);
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json();
}
