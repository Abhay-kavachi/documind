/**
 * E2E Golden Path Test Suite
 *
 * Automates and verifies the complete happy-path flow:
 * 1. Open DocuMind / Access Document Library
 * 2. Load demo document (2026 Enterprise AI Adoption & Operations Report)
 * 3. Ask a known domain question ("What is the total market size and growth?")
 * 4. Retrieval executes -> relevant pages returned
 * 5. Answer generated with confidence and provenance
 * 6. Exact page citation appears (e.g. [Page 2])
 * 7. Click citation -> Evidence viewer opens / resolves to Page 2
 * 8. Correct page preview and evidence image is verified
 * 9. Conversation is persisted and verifiable in database
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb, closeDb } from '@/lib/db';
import { documentService } from '@/lib/services/document-service';
import { answerGenerator } from '@/lib/services/answer-generator';
import { conversationService } from '@/lib/services/conversation-service';
import { DEMO_DOCUMENT_ID } from '@/lib/demo';
import { readFile, fileExists } from '@/lib/storage';

describe('E2E Golden Path — Full Lifecycle Flow', () => {
  const demoUserId = 'demo-user-001';

  beforeAll(() => {
    getDb();
  });

  afterAll(() => {
    closeDb();
  });

  it('Step 1: Retrieves user documents and verifies Demo Document is ready in library', () => {
    const documents = documentService.getUserDocuments(demoUserId);
    expect(documents.length).toBeGreaterThan(0);

    const demoDoc = documents.find(d => d.id === DEMO_DOCUMENT_ID);
    expect(demoDoc).toBeDefined();
    expect(demoDoc?.status).toBe('ready');
    expect(demoDoc?.num_pages).toBe(8);
    expect(demoDoc?.title).toBe('2026 Enterprise AI Adoption & Operations Report');
  });

  it('Step 2: Fetches pages metadata for the loaded demo document', () => {
    const db = getDb();
    const pages = db
      .prepare('SELECT * FROM pages WHERE document_id = ? ORDER BY page_number')
      .all(DEMO_DOCUMENT_ID) as Array<{
      id: string;
      page_number: number;
      section_title: string;
      image_path: string;
    }>;

    expect(pages.length).toBe(8);
    expect(pages[0].page_number).toBe(1);
    expect(pages[0].section_title).toBe('Executive Summary');
    expect(pages[1].page_number).toBe(2);
    expect(pages[1].section_title).toBe('Market Overview');
    expect(pages[3].page_number).toBe(4);
    expect(pages[3].section_title).toBe('Cost Analysis');
  });

  it('Step 3 & 4: Submits question -> executes retrieval -> generates grounded answer', async () => {
    const question = 'What is the market size and breakdown for enterprise AI?';
    const result = await answerGenerator.generateAnswer(question, DEMO_DOCUMENT_ID, demoUserId);

    // Verify retrieval returned relevant page 2
    expect(result.retrieved_pages).toContain(2);

    // Verify answer is generated and grounded
    expect(result.answer).toContain('$247 billion');
    expect(result.answer).toContain('Natural Language');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.provenance).toBeTruthy();

    // Verify citations exist and point to page 2
    expect(result.citations.length).toBeGreaterThan(0);
    const citedPageNumbers = result.citations.map(c => c.page_number);
    expect(citedPageNumbers).toContain(2);
  });

  it('Step 5: Verifies Citation -> Evidence Viewer synchronization (Target Page 2)', () => {
    // Simulate user clicking on [Page 2] citation tag in the UI
    const targetPageNumber = 2;
    const db = getDb();

    const targetPage = db
      .prepare('SELECT * FROM pages WHERE document_id = ? AND page_number = ?')
      .get(DEMO_DOCUMENT_ID, targetPageNumber) as {
      page_number: number;
      section_title: string;
      image_path: string;
      text_content: string;
    } | undefined;

    expect(targetPage).toBeDefined();
    expect(targetPage?.page_number).toBe(2);
    expect(targetPage?.section_title).toBe('Market Overview');

    // Verify page image file exists on storage
    expect(fileExists(targetPage!.image_path)).toBe(true);

    // Verify image buffer is readable and valid PNG
    const imageBuffer = readFile(targetPage!.image_path);
    expect(imageBuffer.length).toBeGreaterThan(0);
    // PNG magic bytes: 0x89 0x50 0x4E 0x47
    expect(imageBuffer[0]).toBe(0x89);
    expect(imageBuffer[1]).toBe(0x50);
    expect(imageBuffer[2]).toBe(0x4e);
    expect(imageBuffer[3]).toBe(0x47);

    // Verify text content of the cited evidence contains the market statistics
    expect(targetPage?.text_content).toContain('247 Billion');
    expect(targetPage?.text_content).toContain('Natural Language');
  });

  it('Step 6: Verifies conversation persistence and history reload', () => {
    const conversations = conversationService.getDocumentConversations(DEMO_DOCUMENT_ID, demoUserId);
    expect(conversations.length).toBeGreaterThan(0);

    const latest = conversations[0];
    expect(latest.document_id).toBe(DEMO_DOCUMENT_ID);
    expect(latest.owner_id).toBe(demoUserId);
    expect(latest.question).toBeTruthy();
    expect(latest.answer).toBeTruthy();
    expect(latest.citations).toBeInstanceOf(Array);
    expect(latest.retrieved_pages).toBeInstanceOf(Array);
    expect(latest.created_at).toBeTruthy();
  });
});
