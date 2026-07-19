-- Mirror of database/seed-data/001_seed.sql
-- Prefer running the file under database/seed-data/ (source of truth).

USE support_tickets;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE comments;
TRUNCATE TABLE tickets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id, name, email, role) VALUES
  (1, 'Alice Requester', 'alice@example.com', 'requester'),
  (2, 'Bob Agent', 'bob@example.com', 'agent'),
  (3, 'Carol Admin', 'carol@example.com', 'admin'),
  (4, 'Dave Agent', 'dave@example.com', 'agent');

INSERT INTO tickets (id, title, description, priority, status, assigned_to, created_by) VALUES
  (
    1,
    'Cannot login to portal',
    'User sees a 500 error after entering valid credentials on the login page.',
    'High',
    'Open',
    2,
    1
  ),
  (
    2,
    'Slow dashboard load',
    'Dashboard takes more than 20 seconds to load during peak hours.',
    'Medium',
    'In Progress',
    2,
    1
  ),
  (
    3,
    'Export CSV missing columns',
    'Ticket export CSV is missing the priority column for some rows.',
    'Medium',
    'Resolved',
    4,
    3
  ),
  (
    4,
    'Password reset email delay',
    'Password reset emails arrive after 30+ minutes. Confirmed fixed after mailer config change.',
    'Low',
    'Closed',
    4,
    1
  ),
  (
    5,
    'Duplicate notification spam',
    'User reported duplicate email notifications; cancelled as duplicate of another ticket.',
    'Low',
    'Cancelled',
    NULL,
    3
  ),
  (
    6,
    'Unassigned printer issue',
    'Office printer offline on floor 3. Not yet assigned to an agent.',
    'High',
    'Open',
    NULL,
    1
  );

INSERT INTO comments (id, ticket_id, message, created_by) VALUES
  (1, 1, 'I can reproduce this on staging with a test account.', 2),
  (2, 1, 'Checking auth service logs now.', 2),
  (3, 2, 'Profiling shows a slow query on the metrics endpoint.', 2),
  (4, 3, 'Fix merged; please verify export includes priority.', 4),
  (5, 3, 'Verified on staging — looks good.', 3),
  (6, 4, 'Closing after customer confirmation.', 4);

ALTER TABLE users AUTO_INCREMENT = 5;
ALTER TABLE tickets AUTO_INCREMENT = 7;
ALTER TABLE comments AUTO_INCREMENT = 7;
