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
