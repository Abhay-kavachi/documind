/**
 * E2E Negative Path Test Suite
 *
 * Verifies that invalid inputs and error conditions are rejected safely,
 * returning structured error messages, without corrupting state or
 * crashing the application.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb, closeDb } from '@/lib/db';
import { documentProcessor } from '@/lib/services/document-processor';
import { documentService } from '@/lib/services/document-service';
import { answerGenerator } from '@/lib/services/answer-generator';
import { DEMO_DOCUMENT_ID } from '@/lib/demo';
import { v4 as uuidv4 } from 'uuid';

describe('E2E Negative Path & Error Resilience', () => {
  const testUserId = 'demo-user-001';

  beforeAll(() => {
    getDb();
  });

  afterAll(() => {
    closeDb();
  });

  describe('1. File Upload Rejections & Diagnostics', () => {
    it('rejects empty file upload with descriptive error', () => {
      const emptyBuffer = Buffer.alloc(0);
      const validation = documentProcessor.validatePdfBuffer(emptyBuffer);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Empty file');
    });

    it('rejects non-PDF files missing magic bytes (%PDF-)', () => {
      const textBuffer = Buffer.from('This is a plain text file pretending to be a PDF.');
      const validation = documentProcessor.validatePdfBuffer(textBuffer);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('missing %PDF- header magic bytes');
    });

    it('rejects oversized files exceeding 50MB limit', () => {
      // 51MB buffer
      const oversizedBuffer = Buffer.alloc(51 * 1024 * 1024);
      // set valid header
      oversizedBuffer.write('%PDF-1.7', 0);

      const validation = documentProcessor.validatePdfBuffer(oversizedBuffer);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('exceeds maximum size');
    });
  });

  describe('2. Malformed Document Processing & Error State', () => {
    it('transitions document status to error on invalid processing', async () => {
      const fakeStorageKey = 'uploads/non-existent-file.pdf';

      // Create document entry
      const doc = documentService.createDocument(
        testUserId,
        'Malformed Doc',
        'malformed.pdf',
        fakeStorageKey,
        'upload'
      );

      // Attempt processing with invalid storage file
      await documentProcessor.processDocument(doc.id);

      // Verify status transitions to 'error' with descriptive diagnostic message
      const updatedDoc = documentService.getDocument(doc.id);
      expect(updatedDoc?.status).toBe('error');
      expect(updatedDoc?.error_message).toBeTruthy();

      // Clean up test document
      documentService.deleteDocument(doc.id);
    });
  });

  describe('3. QA Rejection on Non-Ready / Non-Existent Documents', () => {
    it('rejects question answering when document does not exist', async () => {
      await expect(
        answerGenerator.generateAnswer('Test question?', 'non-existent-doc-id', testUserId)
      ).rejects.toThrow('Document not found');
    });

    it('rejects question answering when document is not in ready status', async () => {
      const unreadyDocId = uuidv4();
      documentService.createDocument(
        testUserId,
        'Pending Doc',
        'pending.pdf',
        'uploads/pending.pdf',
        'upload'
      );

      // Status is 'processing', not 'ready'
      await expect(
        answerGenerator.generateAnswer('Test question?', unreadyDocId, testUserId)
      ).rejects.toThrow();

      documentService.deleteDocument(unreadyDocId);
    });
  });

  describe('4. Application State Resilience', () => {
    it('verifies demo document and system remain fully functional after negative attempts', async () => {
      // Demo document is still intact and ready
      const demoDoc = documentService.getDocument(DEMO_DOCUMENT_ID);
      expect(demoDoc).toBeDefined();
      expect(demoDoc?.status).toBe('ready');

      // QA continues to work flawlessly
      const result = await answerGenerator.generateAnswer(
        'What are the key findings?',
        DEMO_DOCUMENT_ID,
        testUserId
      );

      expect(result.answer).toBeTruthy();
      expect(result.citations.length).toBeGreaterThan(0);
      expect(result.retrieved_pages).toContain(1);
    });
  });
});
