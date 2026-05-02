import { requestJson } from './apiModel';

export function getDashboardSummary() {
  return requestJson('/admin/dashboard');
}

export function getUsers() {
  return requestJson('/admin/users');
}

export function createUser(payload) {
  return requestJson('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateUser(id, payload) {
  return requestJson(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteUser(id) {
  return requestJson(`/admin/users/${id}`, {
    method: 'DELETE'
  });
}

export function createMedicine(payload) {
  return requestJson('/admin/medicines', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateMedicine(id, payload) {
  return requestJson(`/admin/medicines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteMedicine(id) {
  return requestJson(`/admin/medicines/${id}`, {
    method: 'DELETE'
  });
}

export function createCategory(payload) {
  return requestJson('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateCategory(id, payload) {
  return requestJson(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteCategory(id) {
  return requestJson(`/admin/categories/${id}`, {
    method: 'DELETE'
  });
}
