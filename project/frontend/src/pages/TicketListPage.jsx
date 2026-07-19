import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTickets } from '../api/ticketsApi';
import ErrorMessage from '../components/ErrorMessage';
import { STATUSES } from '../constants';

export default function TicketListPage() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listTickets({ q, status });
        if (!cancelled) setTickets(data);
      } catch (err) {
        if (!cancelled) {
          setTickets([]);
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [q, status]);

  return (
    <div className="card">
      <h1>Tickets</h1>

      <div className="row">
        <div style={{ flex: '1 1 220px' }}>
          <label htmlFor="q">Search</label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Keyword in title or description"
          />
        </div>
        <div style={{ flex: '0 1 200px' }}>
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ErrorMessage error={error} />

      {loading && <p className="muted">Loading…</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="muted">No tickets found.</p>
      )}

      {!loading && tickets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link to={`/tickets/${t.id}`}>{t.title}</Link>
                </td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>{t.assignedTo?.name || '—'}</td>
                <td className="muted">
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
