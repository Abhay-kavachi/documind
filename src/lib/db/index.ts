import Database from 'better-sqlite3';
import path from 'path';
import { logEvent } from '@/lib/logger';

let db: Database.Database | null = null;

/**
 * Returns a singleton SQLite database connection.
 * Creates tables on first access.
 */
export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'documind.db');
  db = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initSchema(db);

  logEvent({ level: 'info', event: 'database_initialized', details: { path: dbPath } });
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      storage_key TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'upload',
      status TEXT NOT NULL DEFAULT 'uploading',
      num_pages INTEGER NOT NULL DEFAULT 0,
      doc_type TEXT NOT NULL DEFAULT 'pdf',
      summary TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      section_title TEXT,
      text_content TEXT,
      image_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      UNIQUE(document_id, page_number)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      citations TEXT NOT NULL DEFAULT '[]',
      retrieved_pages TEXT NOT NULL DEFAULT '[]',
      confidence REAL NOT NULL DEFAULT 0,
      provenance TEXT NOT NULL DEFAULT '',
      retrieval_mode TEXT NOT NULL DEFAULT 'demo_fallback',
      status TEXT NOT NULL DEFAULT 'completed',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);
    CREATE INDEX IF NOT EXISTS idx_pages_document ON pages(document_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_document ON conversations(document_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_owner ON conversations(owner_id);
  `);
}

/**
 * Close database connection (for cleanup in tests).
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
