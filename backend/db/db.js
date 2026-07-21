const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "dashboard.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS client_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Done')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
`);

// Seed Data
const { count } = db
  .prepare("SELECT COUNT(*) as count FROM client_requests")
  .get();
if (count === 0) {
  const seed = db.prepare(
    `INSERT INTO client_requests (client_name, description, status) VALUES (?, ?, ?)`,
  );
  seed.run("Joe", "Need help with the project", "New");
  seed.run("Mark", "Question about the project", "In Progress");
  seed.run("Sami", "Set up SSO for the application", "Done");
}

module.exports = db;
