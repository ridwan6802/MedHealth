import { requestJson } from './apiModel';

export function getCart() {
  return requestJson('/cart');
}

export function addToCart(medicineId, quantity = 1) {
  return requestJson('/cart', {
    method: 'POST',
    body: JSON.stringify({ medicineId, quantity })
  });
}

export function updateCartItem(medicineId, quantity) {
  return requestJson(`/cart/${medicineId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}

export function removeFromCart(medicineId) {
  return requestJson(`/cart/${medicineId}`, {
    method: 'DELETE'
  });
}

export function clearCart() {
  return requestJson('/cart', {
    method: 'DELETE'
  });
}
