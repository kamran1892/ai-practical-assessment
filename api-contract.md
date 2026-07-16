# API Contract

> Fill endpoint-by-endpoint during design. Keep request/response examples aligned with implementation.

## Endpoint:

- Method:
- Path:
- Purpose:

### Request

```json
{}
```

### Response

```json
{}
```

### Validation Rules

### Error Responses

---

## Status transition rules (backend)

| From | Allowed next |
| --- | --- |
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | _(none)_ |
| Cancelled | _(none)_ |
