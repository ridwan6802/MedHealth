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

export function getStaffConversation(customerId) {
  return requestJson(`/staff/messages/${customerId}`);
}

export function sendStaffMessage(customerId, message) {
  return requestJson(`/staff/messages/${customerId}`, {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}
