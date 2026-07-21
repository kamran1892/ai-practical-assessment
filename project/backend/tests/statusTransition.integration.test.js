const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');
const { ALLOWED_TRANSITIONS } = require('../src/domain/statusTransition');

const CREATOR_ID = 1;

async function createOpenTicket(titleSuffix) {
  const res = await request(app)
    .post('/api/tickets')
    .send({
      title: `SM test ${titleSuffix}`,
      description: 'Integration test ticket for status state machine',
      priority: 'Low',
      createdBy: CREATOR_ID,
      assignedTo: 2,
    });

  expect(res.status).toBe(201);
  expect(res.body.status).toBe('Open');
  return res.body;
}

async function changeStatus(ticketId, status) {
  return request(app)
    .patch(`/api/tickets/${ticketId}/status`)
    .send({ status });
}

async function moveTo(ticketId, steps) {
  for (const status of steps) {
    const res = await changeStatus(ticketId, status);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(status);
  }
}

/** Bring a fresh ticket to a target status using only valid transitions. */
async function ticketAt(targetStatus) {
  const ticket = await createOpenTicket(targetStatus);
  const paths = {
    Open: [],
    'In Progress': ['In Progress'],
    Resolved: ['In Progress', 'Resolved'],
    Closed: ['In Progress', 'Resolved', 'Closed'],
    Cancelled: ['Cancelled'],
  };
  await moveTo(ticket.id, paths[targetStatus]);
  return ticket.id;
}

afterAll(async () => {
  await pool.end();
});

describe('Status state machine — integration (API + MySQL)', () => {
  describe('all valid transitions succeed', () => {
    const validCases = [
      ['Open', 'In Progress'],
      ['Open', 'Cancelled'],
      ['In Progress', 'Resolved'],
      ['In Progress', 'Cancelled'],
      ['Resolved', 'Closed'],
    ];

    test.each(validCases)('%s → %s', async (from, to) => {
      const ticketId = await ticketAt(from);
      const res = await changeStatus(ticketId, to);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(ticketId);
      expect(res.body.status).toBe(to);

      const detail = await request(app).get(`/api/tickets/${ticketId}`);
      expect(detail.status).toBe(200);
      expect(detail.body.status).toBe(to);
    });

    test('ALLOWED_TRANSITIONS map matches the five Core rules', () => {
      expect(ALLOWED_TRANSITIONS.Open).toEqual(['In Progress', 'Cancelled']);
      expect(ALLOWED_TRANSITIONS['In Progress']).toEqual(['Resolved', 'Cancelled']);
      expect(ALLOWED_TRANSITIONS.Resolved).toEqual(['Closed']);
      expect(ALLOWED_TRANSITIONS.Closed).toEqual([]);
      expect(ALLOWED_TRANSITIONS.Cancelled).toEqual([]);
    });
  });

  describe('invalid transitions are rejected', () => {
    const invalidCases = [
      ['Open', 'Resolved'],
      ['Open', 'Closed'],
      ['Open', 'Open'],
      ['In Progress', 'Open'],
      ['In Progress', 'Closed'],
      ['In Progress', 'In Progress'],
      ['Resolved', 'Open'],
      ['Resolved', 'In Progress'],
      ['Resolved', 'Cancelled'],
      ['Closed', 'Open'],
      ['Closed', 'In Progress'],
      ['Closed', 'Resolved'],
      ['Closed', 'Cancelled'],
      ['Cancelled', 'Open'],
      ['Cancelled', 'In Progress'],
      ['Cancelled', 'Resolved'],
      ['Cancelled', 'Closed'],
    ];

    test.each(invalidCases)('%s → %s returns 400 and leaves status unchanged', async (from, to) => {
      const ticketId = await ticketAt(from);
      const res = await changeStatus(ticketId, to);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid status transition/i);
      expect(res.body.message).toContain(from);
      expect(res.body.message).toContain(to);

      const detail = await request(app).get(`/api/tickets/${ticketId}`);
      expect(detail.status).toBe(200);
      expect(detail.body.status).toBe(from);
    });

    test('unknown status value returns 400', async () => {
      const ticketId = await ticketAt('Open');
      const res = await changeStatus(ticketId, 'Done');

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid status/i);

      const detail = await request(app).get(`/api/tickets/${ticketId}`);
      expect(detail.body.status).toBe('Open');
    });

    test('missing ticket returns 404', async () => {
      const res = await changeStatus(999999, 'In Progress');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
