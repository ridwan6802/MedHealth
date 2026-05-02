import { requestJson } from './apiModel';

export function getStaffNotifications() {
  return requestJson('/staff/notifications');
}

export function createStaffNotification(payload) {
  return requestJson('/staff/notifications', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getAdminNotifications() {
  return requestJson('/admin/notifications');
}

export function markAdminNotificationRead(id) {
  return requestJson(`/admin/notifications/${id}/read`, {
    method: 'PATCH'
  });
}

export function markAllAdminNotificationsRead() {
  return requestJson('/admin/notifications/read-all', {
    method: 'PATCH'
  });
}
