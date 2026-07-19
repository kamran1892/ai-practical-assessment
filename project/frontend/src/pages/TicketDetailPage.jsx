import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  addComment,
  changeTicketStatus,
  getTicket,
  updateTicket,
} from '../api/ticketsApi';
import { listUsers } from '../api/usersApi';
import ErrorMessage from '../components/ErrorMessage';
import { PRIORITIES, getAllowedNextStatuses } from '../constants';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: '',
  });
  const [commentForm, setCommentForm] = useState({ message: '', createdBy: '' });
  const [error, setError] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [ticketData, userData] = await Promise.all([getTicket(id), listUsers()]);
      setTicket(ticketData);
      setUsers(userData);
      setForm({
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        assignedTo: ticketData.assignedTo ? String(ticketData.assignedTo.id) : '',
      });
      if (userData.length && !commentForm.createdBy) {
        setCommentForm((prev) => ({ ...prev, createdBy: String(userData[0].id) }));
      }
    } catch (err) {
      setTicket(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSaveFields(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');
    try {
      const body = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        assignedTo: form.assignedTo ? Number(form.assignedTo) : null,
      };
      const updated = await updateTicket(id, body);
      setTicket(updated);
      setSuccess('Ticket fields saved.');
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onChangeStatus(nextStatus) {
    setChangingStatus(true);
    setStatusError(null);
    setSuccess('');
    try {
      const updated = await changeTicketStatus(id, nextStatus);
      setTicket(updated);
      setSuccess(`Status changed to ${updated.status}.`);
    } catch (err) {
      // Keep current ticket status on screen; show backend message clearly
      setStatusError(err);
    } finally {
      setChangingStatus(false);
    }
  }

  async function onAddComment(e) {
    e.preventDefault();
    setAddingComment(true);
    setError(null);
    setSuccess('');
    try {
      await addComment(id, {
        message: commentForm.message,
        createdBy: Number(commentForm.createdBy),
      });
      const refreshed = await getTicket(id);
      setTicket(refreshed);
      setCommentForm((prev) => ({ ...prev, message: '' }));
      setSuccess('Comment added.');
    } catch (err) {
      setError(err);
    } finally {
      setAddingComment(false);
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p className="muted">Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="card">
        <ErrorMessage error={error} />
        <Link to="/tickets">Back to list</Link>
      </div>
    );
  }

  const nextStatuses = getAllowedNextStatuses(ticket.status);

  return (
    <div className="stack">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h1 style={{ marginBottom: 0 }}>Ticket #{ticket.id}</h1>
          <Link className="button" to="/tickets">
            Back to list
          </Link>
        </div>

        <p>
          <strong>Status:</strong> {ticket.status}{' '}
          <span className="muted">
            · Created by {ticket.createdBy?.name || '—'} ·{' '}
            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ''}
          </span>
        </p>

        {success && <div className="success">{success}</div>}
        <ErrorMessage error={error} />
      </div>

      <div className="card">
        <h2>Update fields</h2>
        <form onSubmit={onSaveFields}>
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
            <label htmlFor="assignedTo">Assignee</label>
            <select
              id="assignedTo"
              value={form.assignedTo}
              onChange={(e) => updateField('assignedTo', e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <button className="primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save fields'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Change status</h2>
        <p className="muted">Current: {ticket.status}</p>
        <ErrorMessage error={statusError} />
        {nextStatuses.length === 0 ? (
          <p className="muted">No further status changes are allowed from this status.</p>
        ) : (
          <div className="status-actions">
            {nextStatuses.map((s) => (
              <button
                key={s}
                type="button"
                disabled={changingStatus}
                onClick={() => onChangeStatus(s)}
              >
                → {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Comments</h2>
        {(ticket.comments || []).length === 0 && (
          <p className="muted">No comments yet.</p>
        )}
        {(ticket.comments || []).map((c) => (
          <div key={c.id} className="comment">
            <div>
              <strong>{c.createdBy?.name || 'Unknown'}</strong>{' '}
              <span className="muted">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
              </span>
            </div>
            <div>{c.message}</div>
          </div>
        ))}

        <h3>Add comment</h3>
        <form onSubmit={onAddComment}>
          <div className="field">
            <label htmlFor="commentAuthor">Author</label>
            <select
              id="commentAuthor"
              value={commentForm.createdBy}
              onChange={(e) =>
                setCommentForm((prev) => ({ ...prev, createdBy: e.target.value }))
              }
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="commentMessage">Message</label>
            <textarea
              id="commentMessage"
              value={commentForm.message}
              onChange={(e) =>
                setCommentForm((prev) => ({ ...prev, message: e.target.value }))
              }
              required
            />
          </div>
          <button className="primary" type="submit" disabled={addingComment}>
            {addingComment ? 'Adding…' : 'Add comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
