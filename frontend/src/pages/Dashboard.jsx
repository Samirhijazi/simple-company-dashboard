import { useEffect, useState, useCallback, useMemo } from 'react';
import { requestsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import NewRequestForm from '../components/NewRequestForm';
import RequestTable from '../components/RequestTable';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setError('');
      const data = await requestsApi.getAll();
      setRequests(data);
    } catch (err) {
      setError('Could not load client requests. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCreate = async (payload) => {
    setCreating(true);
    setError('');
    try {
      const created = await requestsApi.create(payload);
      setRequests((prev) => [created, ...prev]);
    } catch (err) {
      setError('Could not create the request. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleAdvance = async (id) => {
    setUpdatingId(id);
    setError('');
    // Optimistic-ish: we still wait for the server response since it owns the
    // status-flow logic, but we scope the "updating" state to just this row.
    try {
      const updated = await requestsApi.advanceStatus(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError('Could not update the request status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const summary = useMemo(() => {
    return requests.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      { New: 0, 'In Progress': 0, Done: 0 }
    );
  }, [requests]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          Client<span>Requests</span>
        </div>
        <div className="user-info">
          <span>{user?.email}</span>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2>Client Requests</h2>
            <p>Track incoming requests from New through Done.</p>
          </div>
          <div className="summary-pills">
            <span className="pill">New: {summary.New}</span>
            <span className="pill">In Progress: {summary['In Progress']}</span>
            <span className="pill">Done: {summary.Done}</span>
          </div>
        </div>

        {error && <div className="top-error">{error}</div>}

        <NewRequestForm onCreate={handleCreate} creating={creating} />

        {loading ? (
          <div className="table-card">
            <div className="loading-state">Loading requests…</div>
          </div>
        ) : (
          <RequestTable
            requests={requests}
            onAdvance={handleAdvance}
            updatingId={updatingId}
          />
        )}
      </main>
    </div>
  );
}
