import { requestJson } from './apiModel';

export function getProfile() {
  return requestJson('/auth/me');
}

export function updateProfile(payload) {
  return requestJson('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}