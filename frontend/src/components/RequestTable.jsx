const STATUS_CLASS = {
  New: 'status-new',
  'In Progress': 'status-in-progress',
  Done: 'status-done',
};

function formatDate(isoString) {
  if (!isoString) return '—';
  // SQLite datetime('now') returns UTC without a timezone suffix; treat it as UTC.
  const date = new Date(isoString.replace(' ', 'T') + 'Z');
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function RequestTable({ requests, onAdvance, updatingId }) {
  if (requests.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">No client requests yet. Add the first one above.</div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Request</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const isDone = req.status === 'Done';
            const isUpdating = updatingId === req.id;
            return (
              <tr key={req.id}>
                <td className="client-name">{req.client_name}</td>
                <td>{req.description}</td>
                <td>
                  <span className={`status-badge ${STATUS_CLASS[req.status]}`}>
                    {req.status}
                  </span>
                </td>
                <td>{formatDate(req.created_at)}</td>
                <td>
                  <button
                    className="advance-btn"
                    disabled={isDone || isUpdating}
                    onClick={() => onAdvance(req.id)}
                    title={isDone ? 'Request is complete' : 'Move to next status'}
                  >
                    {isUpdating ? 'Updating…' : isDone ? 'Complete' : 'Advance →'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
