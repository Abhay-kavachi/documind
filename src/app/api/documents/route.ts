import { NextResponse } from 'next/server';
import { getSessionUser, AuthorizationError } from '@/lib/auth';
import { documentService } from '@/lib/services/document-service';
import { documentProcessor } from '@/lib/services/document-processor';
import { saveUploadedFile } from '@/lib/storage';
import { logEvent } from '@/lib/logger';

/**
 * GET /api/documents — List the current user's documents.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    const documents = documentService.getUserDocuments(user.id);
    return NextResponse.json({ data: documents });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents — Upload a new PDF document.
 * Accepts multipart/form-data with a 'file' field.
 */
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted', code: 'INVALID_FILE_TYPE' },
        { status: 400 }
      );
    }

    // Validate extension
    const fileName = file.name || 'document.pdf';
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must have a .pdf extension', code: 'INVALID_FILE_TYPE' },
        { status: 400 }
      );
    }

    // Validate filename for path traversal
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\') || fileName.includes('\0')) {
      return NextResponse.json(
        { error: 'Invalid filename', code: 'INVALID_FILENAME' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate PDF structure
    const validation = documentProcessor.validatePdfBuffer(buffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, code: 'INVALID_PDF' },
        { status: 400 }
      );
    }

    // Save to storage with UUID-based key (never use raw filename)
    const storageKey = saveUploadedFile(buffer, fileName);

    // Create document record
    const title = fileName.replace(/\.pdf$/i, '');
    const doc = documentService.createDocument(user.id, title, fileName, storageKey, 'upload');

    // Kick off processing (inline for MVP)
    documentProcessor.processDocument(doc.id).catch(err => {
      logEvent({
        level: 'error',
        event: 'async_processing_failed',
        document_id: doc.id,
        details: { error: String(err) },
      });
    });

    return NextResponse.json({ data: doc }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: error.statusCode }
      );
    }
    logEvent({
      level: 'error',
      event: 'upload_failed',
      details: { error: error instanceof Error ? error.message : 'Unknown' },
    });
    return NextResponse.json(
      { error: 'Upload failed', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
