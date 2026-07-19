import { apiRequest } from './client';

export function listUsers() {
  return apiRequest('/api/users');
}
