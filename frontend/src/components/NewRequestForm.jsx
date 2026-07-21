import { useState } from 'react';

export default function NewRequestForm({ onCreate, creating }) {
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !description.trim()) return;
    onCreate({ client_name: clientName.trim(), description: description.trim() });
    setClientName('');
    setDescription('');
  };

  return (
    <div className="new-request-card">
      <h3>New client request</h3>
      <form className="new-request-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          aria-label="Client name"
        />
        <input
          type="text"
          placeholder="Request description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Request description"
        />
        <button className="btn-add" type="submit" disabled={creating}>
          {creating ? 'Adding…' : 'Add request'}
        </button>
      </form>
    </div>
  );
}
