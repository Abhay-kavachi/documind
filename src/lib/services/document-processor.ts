import { PDFDocument } from 'pdf-lib';
import { readFile, savePageImage } from '@/lib/storage';
import { getDb } from '@/lib/db';
import { documentService } from './document-service';
import { pageRenderer } from './page-renderer';
import { logEvent } from '@/lib/logger';

const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE || '52428800', 10); // 50MB
const MAX_PAGES = parseInt(process.env.MAX_PAGES || '200', 10);

/**
 * DocumentProcessor — validates, processes, and indexes uploaded PDFs.
 * Handles the full lifecycle: validate → count pages → render → persist → mark ready.
 */
export const documentProcessor = {
  validatePdfBuffer(buffer: Buffer): { valid: boolean; error?: string } {
    if (buffer.length === 0) {
      return { valid: false, error: 'Empty file' };
    }

    if (buffer.length > MAX_FILE_SIZE) {
      return { valid: false, error: `File exceeds maximum size of ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB` };
    }

    // Check PDF magic bytes
    if (buffer.length < 5 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      return { valid: false, error: 'Invalid PDF: missing %PDF- header magic bytes' };
    }

    return { valid: true };
  },

  async processDocument(documentId: string): Promise<void> {
    const startTime = Date.now();
    const doc = documentService.getDocument(documentId);

    if (!doc) {
      logEvent({
        level: 'error',
        event: 'processing_document_not_found',
        document_id: documentId,
      });
      return;
    }

    try {
      documentService.updateDocumentStatus(documentId, 'processing');

      const pdfBuffer = readFile(doc.storage_key);

      // Validate PDF structure using pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      const numPages = pdfDoc.getPageCount();

      if (numPages === 0) {
        throw new Error('PDF contains no pages');
      }

      if (numPages > MAX_PAGES) {
        throw new Error(`Document has ${numPages} pages, exceeding the limit of ${MAX_PAGES}`);
      }

      documentService.updateDocumentPages(documentId, numPages);

      const db = getDb();
      const insertPage = db.prepare(`
        INSERT OR REPLACE INTO pages (id, document_id, page_number, section_title, text_content, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      // Process each page
      for (let i = 1; i <= numPages; i++) {
        const imageBuffer = await pageRenderer.renderPage(pdfBuffer, i, documentId);
        const imagePath = savePageImage(documentId, i, imageBuffer);

        const pageId = crypto.randomUUID();
        insertPage.run(
          pageId,
          documentId,
          i,
          `Page ${i}`, // Section title - basic for uploaded docs
          null, // Text content - would need OCR for real extraction
          imagePath
        );
      }

      documentService.updateDocumentStatus(documentId, 'ready');

      logEvent({
        level: 'info',
        event: 'document_processing_complete',
        document_id: documentId,
        duration_ms: Date.now() - startTime,
        details: { num_pages: numPages },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
      logEvent({
        level: 'error',
        event: 'document_processing_failed',
        document_id: documentId,
        duration_ms: Date.now() - startTime,
        details: { error: errorMessage },
      });
      documentService.updateDocumentStatus(documentId, 'error', errorMessage);
    }
  },
};
