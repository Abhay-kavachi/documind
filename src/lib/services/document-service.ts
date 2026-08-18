import { getDb } from '@/lib/db';
import type { DocumentRecord, DocumentStatus, DocumentSource } from '@/lib/types';
import { logEvent } from '@/lib/logger';
import { deleteDocumentFiles } from '@/lib/storage';

/**
 * DocumentService — CRUD and lifecycle management for documents.
 * All queries are parameterized. Never concatenates user input into SQL.
 */
export const documentService = {
  createDocument(
    ownerId: string,
    title: string,
    fileName: string,
    storageKey: string,
    source: DocumentSource = 'upload'
  ): DocumentRecord {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO documents (id, owner_id, title, file_name, storage_key, source, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, ownerId, title, fileName, storageKey, source, 'processing', now, now);

    logEvent({
      level: 'info',
      event: 'document_created',
      document_id: id,
      user_id: ownerId,
    });

    return this.getDocument(id)!;
  },

  getDocument(id: string): DocumentRecord | null {
    const db = getDb();
    return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as DocumentRecord | null;
  },

  getUserDocuments(ownerId: string): DocumentRecord[] {
    const db = getDb();
    return db
      .prepare('SELECT * FROM documents WHERE owner_id = ? ORDER BY updated_at DESC')
      .all(ownerId) as DocumentRecord[];
  },

  updateDocumentStatus(id: string, status: DocumentStatus, errorMessage?: string): void {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare('UPDATE documents SET status = ?, error_message = ?, updated_at = ? WHERE id = ?')
      .run(status, errorMessage || null, now, id);

    logEvent({
      level: status === 'error' ? 'error' : 'info',
      event: 'document_status_updated',
      document_id: id,
      details: { status, error_message: errorMessage },
    });
  },

  updateDocumentPages(id: string, numPages: number): void {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare('UPDATE documents SET num_pages = ?, updated_at = ? WHERE id = ?')
      .run(numPages, now, id);
  },

  deleteDocument(id: string): void {
    const db = getDb();
    const doc = this.getDocument(id);

    if (doc) {
      try {
        deleteDocumentFiles(id, doc.storage_key);
      } catch (e) {
        logEvent({
          level: 'error',
          event: 'document_files_delete_failed',
          document_id: id,
          details: { error: String(e) },
        });
      }

      // CASCADE handles pages and conversations via FK constraints,
      // but we delete explicitly for safety
      const tx = db.transaction(() => {
        db.prepare('DELETE FROM conversations WHERE document_id = ?').run(id);
        db.prepare('DELETE FROM pages WHERE document_id = ?').run(id);
        db.prepare('DELETE FROM documents WHERE id = ?').run(id);
      });
      tx();

      logEvent({ level: 'info', event: 'document_deleted', document_id: id });
    }
  },
};
