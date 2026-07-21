const db = require("../db/db");

const STATUS_FLOW = ["New", "In Progress", "Done"];

function getAllRequests() {
  return db
    .prepare("SELECT * FROM client_requests ORDER BY created_at DESC")
    .all();
}

function getRequestById(id) {
  return db.prepare("SELECT * FROM client_requests WHERE id = ?").get(id);
}

function createRequest({ client_name, description }) {
  const stmt = db.prepare(
    `INSERT INTO client_requests (client_name, description, status)
     VALUES (?, ?, 'New')`,
  );
  const info = stmt.run(client_name, description);
  return getRequestById(info.lastInsertRowid);
}

function advanceStatus(id) {
  const existing = getRequestById(id);
  if (!existing) return null;

  const currentIndex = STATUS_FLOW.indexOf(existing.status);
  const isLastStep =
    currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1;
  const nextStatus = isLastStep
    ? existing.status
    : STATUS_FLOW[currentIndex + 1];

  db.prepare(
    `UPDATE client_requests SET status = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(nextStatus, id);

  return getRequestById(id);
}

function setStatus(id, status) {
  if (!STATUS_FLOW.includes(status)) {
    throw new Error(
      `Invalid status "${status}". Must be one of ${STATUS_FLOW.join(", ")}`,
    );
  }
  const existing = getRequestById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE client_requests SET status = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(status, id);

  return getRequestById(id);
}

module.exports = {
  STATUS_FLOW,
  getAllRequests,
  createRequest,
  advanceStatus,
  setStatus,
};
