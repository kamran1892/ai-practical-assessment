import { Link, Navigate, Route, Routes } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import { getApiBaseUrl } from './api/client';

export default function App() {
  return (
    <div className="container">
      <header className="nav">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>Support Tickets</strong>
            <div className="muted">API: {getApiBaseUrl()}</div>
          </div>
          <div className="row">
            <Link className="button" to="/tickets">
              All tickets
            </Link>
            <Link className="button primary" to="/tickets/new">
              New ticket
            </Link>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
      </Routes>
    </div>
  );
}
