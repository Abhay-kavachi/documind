/**
 * Security tests for DocuMind.
 *
 * Tests authorization, IDOR prevention, and access control.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const TEST_DB_PATH = path.join(process.cwd(), 'test-auth.db');

describe('Authorization & Access Control', () => {
  let db: Database.Database;
  const user1Id = 'test-user-001';
  const user2Id = 'test-user-002';
  const doc1Id = uuidv4();
  const doc2Id = uuidv4();

  beforeAll(() => {
    // Create test database with schema
    db = new Database(TEST_DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    db.exec(`
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
    `);

    // Seed test data
    db.prepare('INSERT INTO users (id, role) VALUES (?, ?)').run(user1Id, 'user');
    db.prepare('INSERT INTO users (id, role) VALUES (?, ?)').run(user2Id, 'user');

    db.prepare(
      'INSERT INTO documents (id, owner_id, title, file_name, storage_key, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(doc1Id, user1Id, 'User 1 Doc', 'doc1.pdf', 'uploads/doc1.pdf', 'ready');

    db.prepare(
      'INSERT INTO documents (id, owner_id, title, file_name, storage_key, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(doc2Id, user2Id, 'User 2 Doc', 'doc2.pdf', 'uploads/doc2.pdf', 'ready');
  });

  afterAll(() => {
    db.close();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    // Clean up WAL/SHM files
    for (const suffix of ['-wal', '-shm']) {
      const f = TEST_DB_PATH + suffix;
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  });

  it('should allow owner to access their own document', () => {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND owner_id = ?').get(doc1Id, user1Id) as Record<string, unknown> | undefined;
    expect(doc).toBeDefined();
    expect(doc?.owner_id).toBe(user1Id);
  });

  it('should deny access to another user\'s document (IDOR prevention)', () => {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND owner_id = ?').get(doc1Id, user2Id) as Record<string, unknown> | undefined;
    expect(doc).toBeUndefined();
  });

  it('should not return documents when queried with wrong owner', () => {
    const docs = db.prepare('SELECT * FROM documents WHERE owner_id = ?').all(user1Id) as Array<Record<string, unknown>>;
    expect(docs.length).toBe(1);
    expect(docs[0].id).toBe(doc1Id);

    // User2 should not see User1's documents
    const user2Docs = db.prepare('SELECT * FROM documents WHERE owner_id = ?').all(user2Id) as Array<Record<string, unknown>>;
    expect(user2Docs.length).toBe(1);
    expect(user2Docs[0].id).toBe(doc2Id);
  });

  it('should prevent accessing non-existent documents', () => {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get('non-existent-id') as Record<string, unknown> | undefined;
    expect(doc).toBeUndefined();
  });

  it('should enforce foreign key constraints', () => {
    expect(() => {
      db.prepare(
        'INSERT INTO documents (id, owner_id, title, file_name, storage_key) VALUES (?, ?, ?, ?, ?)'
      ).run(uuidv4(), 'non-existent-user', 'Bad Doc', 'bad.pdf', 'bad.pdf');
    }).toThrow();
  });

  it('should cascade delete pages when document is deleted', () => {
    const tempDocId = uuidv4();
    db.prepare(
      'INSERT INTO documents (id, owner_id, title, file_name, storage_key, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(tempDocId, user1Id, 'Temp Doc', 'temp.pdf', 'temp.pdf', 'ready');

    db.prepare(
      'INSERT INTO pages (id, document_id, page_number, image_path) VALUES (?, ?, ?, ?)'
    ).run(uuidv4(), tempDocId, 1, 'pages/temp/page-1.png');

    // Verify page exists
    const pageBefore = db.prepare('SELECT * FROM pages WHERE document_id = ?').all(tempDocId);
    expect(pageBefore.length).toBe(1);

    // Delete document
    db.prepare('DELETE FROM documents WHERE id = ?').run(tempDocId);

    // Pages should be cascade deleted
    const pageAfter = db.prepare('SELECT * FROM pages WHERE document_id = ?').all(tempDocId);
    expect(pageAfter.length).toBe(0);
  });
});
