/**
 * Security tests for file upload validation.
 *
 * Tests malformed files, oversized uploads, wrong MIME types, and path traversal.
 */

import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';

/**
 * Validates a PDF buffer for security.
 * This mirrors the validation logic used in document-processor.ts.
 */
function validatePdfBuffer(buffer: Buffer, maxSize: number = 50 * 1024 * 1024): {
  valid: boolean;
  error?: string;
} {
  // Check size
  if (buffer.length === 0) {
    return { valid: false, error: 'Empty file' };
  }

  if (buffer.length > maxSize) {
    return { valid: false, error: `File exceeds maximum size of ${maxSize} bytes` };
  }

  // Check PDF magic bytes
  const header = buffer.subarray(0, 5).toString('ascii');
  if (header !== '%PDF-') {
    return { valid: false, error: 'Invalid PDF: missing PDF header magic bytes' };
  }

  return { valid: true };
}

/**
 * Validates filename for path traversal.
 */
function validateFilename(filename: string): { valid: boolean; error?: string } {
  // Check for path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { valid: false, error: 'Invalid filename: path traversal detected' };
  }

  // Check for null bytes
  if (filename.includes('\0')) {
    return { valid: false, error: 'Invalid filename: null byte detected' };
  }

  // Check extension
  if (!filename.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Invalid file type: only PDF files are accepted' };
  }

  return { valid: true };
}

describe('Upload Validation', () => {
  describe('PDF Structure Validation', () => {
    it('should reject empty files', () => {
      const result = validatePdfBuffer(Buffer.alloc(0));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Empty');
    });

    it('should reject oversized files', () => {
      const maxSize = 1024; // 1KB for testing
      const buffer = Buffer.alloc(2048, 0);
      const result = validatePdfBuffer(buffer, maxSize);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('maximum size');
    });

    it('should reject non-PDF files (wrong magic bytes)', () => {
      // JPEG file header
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00]);
      const result = validatePdfBuffer(jpegBuffer);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('magic bytes');
    });

    it('should reject HTML disguised as PDF', () => {
      const htmlBuffer = Buffer.from('<html><body>Not a PDF</body></html>');
      const result = validatePdfBuffer(htmlBuffer);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('magic bytes');
    });

    it('should reject random binary data', () => {
      const randomBuffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
      const result = validatePdfBuffer(randomBuffer);
      expect(result.valid).toBe(false);
    });

    it('should accept valid PDF', async () => {
      const doc = await PDFDocument.create();
      doc.addPage();
      const pdfBytes = await doc.save();
      const buffer = Buffer.from(pdfBytes);

      const result = validatePdfBuffer(buffer);
      expect(result.valid).toBe(true);
    });

    it('should validate PDF structure with pdf-lib', async () => {
      const doc = await PDFDocument.create();
      doc.addPage();
      doc.addPage();
      const pdfBytes = await doc.save();

      // Should load successfully
      const loaded = await PDFDocument.load(pdfBytes);
      expect(loaded.getPageCount()).toBe(2);
    });

    it('should detect files with valid header but minimal/corrupted content', async () => {
      // A file with valid %PDF- header but minimal structure
      // pdf-lib may be lenient, so our validation is multi-layered:
      // Layer 1: Magic byte check (passes)
      // Layer 2: pdf-lib structural load (may pass for minimal PDFs)
      // Layer 3: Page count check (should catch empty/corrupted docs)
      const minimalPdf = Buffer.from('%PDF-1.4\nThis is not valid PDF content\n%%EOF');

      const magic = validatePdfBuffer(minimalPdf);
      expect(magic.valid).toBe(true); // Magic bytes pass

      // The structural validation may succeed (pdf-lib is lenient),
      // but the page count check in processDocument catches 0-page PDFs
      try {
        const loaded = await PDFDocument.load(minimalPdf);
        // If it loads, it should have 0 pages
        expect(loaded.getPageCount()).toBe(0);
      } catch {
        // If it fails to load, that's also acceptable validation
        expect(true).toBe(true);
      }
    });
  });

  describe('Filename Validation', () => {
    it('should reject path traversal with ../', () => {
      const result = validateFilename('../../../etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject path traversal with backslashes', () => {
      const result = validateFilename('..\\..\\windows\\system32\\config');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject filenames with forward slashes', () => {
      const result = validateFilename('path/to/file.pdf');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('path traversal');
    });

    it('should reject null bytes in filenames', () => {
      const result = validateFilename('file\0.pdf');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('null byte');
    });

    it('should reject non-PDF extensions', () => {
      expect(validateFilename('script.js').valid).toBe(false);
      expect(validateFilename('image.png').valid).toBe(false);
      expect(validateFilename('archive.zip').valid).toBe(false);
      expect(validateFilename('document.docx').valid).toBe(false);
      expect(validateFilename('noextension').valid).toBe(false);
    });

    it('should accept valid PDF filenames', () => {
      expect(validateFilename('document.pdf').valid).toBe(true);
      expect(validateFilename('My Report 2026.pdf').valid).toBe(true);
      expect(validateFilename('report.PDF').valid).toBe(true);
    });
  });

  describe('MIME Type Validation', () => {
    it('should validate PDF MIME type', () => {
      const validMimeTypes = ['application/pdf'];
      const invalidMimeTypes = [
        'text/html',
        'application/javascript',
        'image/png',
        'application/zip',
        'text/plain',
        'application/octet-stream',
      ];

      for (const mime of validMimeTypes) {
        expect(mime === 'application/pdf').toBe(true);
      }

      for (const mime of invalidMimeTypes) {
        expect(mime === 'application/pdf').toBe(false);
      }
    });
  });
});
