import { apiRequest } from './client';

function toQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      qs.set(key, value);
    }
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export function listTickets({ q, status } = {}) {
  return apiRequest(`/api/tickets${toQuery({ q, status })}`);
}

export function getTicket(id) {
  return apiRequest(`/api/tickets/${id}`);
}

export function createTicket(body) {
  return apiRequest('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateTicket(id, body) {
  return apiRequest(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function changeTicketStatus(id, status) {
  return apiRequest(`/api/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function listComments(ticketId) {
  return apiRequest(`/api/tickets/${ticketId}/comments`);
}

export function addComment(ticketId, body) {
  return apiRequest(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
