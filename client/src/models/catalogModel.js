import { requestJson } from './apiModel';

export function getMedicines() {
  return requestJson('/medicines');
}

export function getCategories() {
  return requestJson('/categories');
}
