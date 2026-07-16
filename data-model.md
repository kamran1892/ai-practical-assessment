# Data Model

## Database choice

MySQL (local)

## Entities

### User (seeded only — no user-management UI)

| Field | Type | Notes |
| --- | --- | --- |
| id | | |
| name | | |
| email | | |
| role | | |

### Ticket

| Field | Type | Notes |
| --- | --- | --- |
| id | | |
| title | | |
| description | | |
| priority | | |
| status | | |
| assignedTo | | FK → User |
| createdBy | | FK → User |
| createdAt | | |
| updatedAt | | |

### Comment

| Field | Type | Notes |
| --- | --- | --- |
| id | | |
| ticketId | | FK → Ticket |
| message | | |
| createdBy | | FK → User |
| createdAt | | |

## Relationships

<!-- -->

## Indexes / search notes

<!-- keyword search fields, status filter -->

## ER sketch

<!-- ASCII or describe; optional diagram later -->
