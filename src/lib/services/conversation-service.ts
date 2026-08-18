import { getDb } from '@/lib/db';
import type { ConversationRecord, Citation } from '@/lib/types';
import { logEvent } from '@/lib/logger';

/**
 * ConversationService — CRUD for question-answer conversations.
 * All queries are parameterized.
 */
export const conversationService = {
  createConversation(data: {
    documentId: string;
    ownerId: string;
    question: string;
    answer: string;
    citations: Citation[];
    retrievedPages: number[];
    confidence: number;
    provenance: string;
    retrievalMode: string;
  }): ConversationRecord {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO conversations (id, document_id, owner_id, question, answer, citations, retrieved_pages, confidence, provenance, retrieval_mode, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.documentId,
      data.ownerId,
      data.question,
      data.answer,
      JSON.stringify(data.citations),
      JSON.stringify(data.retrievedPages),
      data.confidence,
      data.provenance,
      data.retrievalMode,
      'completed',
      now
    );

    logEvent({
      level: 'info',
      event: 'conversation_created',
      document_id: data.documentId,
      user_id: data.ownerId,
      details: { conversation_id: id },
    });

    return this.getConversation(id)!;
  },

  getDocumentConversations(documentId: string, ownerId: string): ConversationRecord[] {
    const db = getDb();
    const rows = db
      .prepare(
        'SELECT * FROM conversations WHERE document_id = ? AND owner_id = ? ORDER BY created_at DESC'
      )
      .all(documentId, ownerId) as Array<Record<string, unknown>>;

    return rows.map(parseConversationRow);
  },

  getConversation(id: string): ConversationRecord | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return parseConversationRow(row);
  },
};

/**
 * Parse a raw database row into a ConversationRecord,
 * deserializing JSON fields.
 */
function parseConversationRow(row: Record<string, unknown>): ConversationRecord {
  return {
    id: row.id as string,
    document_id: row.document_id as string,
    owner_id: row.owner_id as string,
    question: row.question as string,
    answer: row.answer as string,
    citations: typeof row.citations === 'string' ? JSON.parse(row.citations) : (row.citations as Citation[]),
    retrieved_pages: typeof row.retrieved_pages === 'string' ? JSON.parse(row.retrieved_pages) : (row.retrieved_pages as number[]),
    confidence: row.confidence as number,
    provenance: row.provenance as string,
    retrieval_mode: row.retrieval_mode as string,
    status: row.status as 'completed' | 'error',
    created_at: row.created_at as string,
  };
}
