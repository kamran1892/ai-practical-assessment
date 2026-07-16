# Spec

## Goal

Build a working Core Support Ticket Management System with React + Node.js + MySQL.

## Entities

- User (seeded)
- Ticket
- Comment

## Status state machine

- Open → In Progress
- In Progress → Resolved
- Resolved → Closed
- Open → Cancelled
- In Progress → Cancelled

Invalid transitions must be rejected by backend and shown clearly in UI.

## Core features

See root `acceptance-criteria.md`.

## Non-goals

Stretch features listed in the assessment guide.
