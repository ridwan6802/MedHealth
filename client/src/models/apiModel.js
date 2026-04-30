import { sessionModel } from './sessionModel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function requestJson(path, options = {}) {
  const token = sessionModel.getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}
