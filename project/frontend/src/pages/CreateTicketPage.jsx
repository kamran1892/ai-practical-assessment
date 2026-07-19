import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketsApi';
import { listUsers } from '../api/usersApi';
import ErrorMessage from '../components/ErrorMessage';
import { PRIORITIES } from '../constants';

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  createdBy: '',
  assignedTo: '',
};

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      setLoadingUsers(true);
      setError(null);
      try {
        const data = await listUsers();
        if (!cancelled) {
          setUsers(data);
          if (data.length) {
            setForm((prev) => ({ ...prev, createdBy: String(data[0].id) }));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }
    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const body = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      createdBy: Number(form.createdBy),
    };
    if (form.assignedTo) {
      body.assignedTo = Number(form.assignedTo);
    }

    try {
      const ticket = await createTicket(body);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h1>Create ticket</h1>
      <p className="muted">New tickets always start as Open.</p>

      <ErrorMessage error={error} />

      {loadingUsers ? (
        <p className="muted">Loading users…</p>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={form.priority}
              onChange={(e) => updateField('priority', e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="createdBy">Created by</label>
            <select
              id="createdBy"
              value={form.createdBy}
              onChange={(e) => updateField('createdBy', e.target.value)}
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="assignedTo">Assignee (optional)</label>
            <select
              id="assignedTo"
              value={form.assignedTo}
              onChange={(e) => updateField('assignedTo', e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <button className="primary" type="submit" disabled={submitting || !users.length}>
              {submitting ? 'Creating…' : 'Create ticket'}
            </button>
            <Link className="button" to="/tickets">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
