const BASE_URL = import.meta.env.VITE_API_URL || '/api/projects';

export async function getProjects(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.order) query.append('order', params.order);

  const url = `${BASE_URL}${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch projects (${res.status})`);
  }
  return res.json();
}

export async function getProjectById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch project ${id}`);
  }
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create project');
  }
  return res.json();
}

export async function updateProject(id, projectData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete project');
  }
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return res.json();
}

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json();
}
