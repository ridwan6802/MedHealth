import { sessionModel } from './sessionModel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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

export async function login(credentials) {
  const data = await requestJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

  sessionModel.setToken(data.token);
  sessionModel.setUser(data.user);
  return data;
}

export async function register(payload) {
  const data = await requestJson('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  sessionModel.setToken(data.token);
  sessionModel.setUser(data.user);
  return data;
}

export function logout() {
  sessionModel.clearSession();
}
