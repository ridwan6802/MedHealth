import { requestJson } from './apiModel';

export function getCustomerMessages() {
  return requestJson('/chat');
}

export function sendCustomerMessage(message) {
  return requestJson('/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}

export function getStaffMessages() {
  return requestJson('/staff/messages');
}

export function getStaffMessageThreads() {
  return requestJson('/staff/messages/threads');
}

export function getStaffConversation(customerId) {
  return requestJson(`/staff/messages/${customerId}`);
}

export function markStaffConversationRead(customerId) {
  return requestJson(`/staff/messages/${customerId}/read`, {
    method: 'PATCH'
  });
}

export function sendStaffMessage(customerId, message) {
  return requestJson(`/staff/messages/${customerId}`, {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}
