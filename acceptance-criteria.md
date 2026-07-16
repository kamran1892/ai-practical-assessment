# Acceptance Criteria

## Core

- [ ] A user can create a ticket via the UI
- [ ] A user can view all tickets from the database
- [ ] A user can open a ticket detail view
- [ ] A user can update ticket fields (title, description, priority, assignee)
- [ ] A user can add comments
- [ ] Status changes only through valid transitions; invalid ones are rejected
- [ ] Keyword search and status filter work
- [ ] Data remains available after restart
- [ ] Backend validation prevents invalid records
- [ ] No secrets committed to the repo
- [ ] State-machine integration tests pass

## Validation

- [ ] Required fields enforced on backend
- [ ] Invalid input rejected with clear messages

## Error Handling

- [ ] Backend returns meaningful errors
- [ ] Frontend shows meaningful error states

## Testing

- [ ] Integration tests prove valid status transitions succeed
- [ ] Integration tests prove invalid status transitions are rejected

## Documentation

- [ ] README has setup instructions
- [ ] Database setup / migrations / seed documented
- [ ] Prompt history and lifecycle artifacts present
