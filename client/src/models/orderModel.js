import { requestJson } from './apiModel';

export function getOrders() {
  return requestJson('/orders');
}

export function createOrder(payload) {
  return requestJson('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getStaffOrderThreads() {
  return requestJson('/staff/orders');
}

export function getStaffCustomerOrders(customerId) {
  return requestJson(`/staff/orders/${customerId}`);
}

export function updateStaffOrderStatus(orderId, status) {
  return requestJson(`/staff/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}
