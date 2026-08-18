import { NextResponse } from 'next/server';
import { getSessionUser, verifyDocumentOwnership, AuthorizationError } from '@/lib/auth';
import { documentService } from '@/lib/services/document-service';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/[id] — Get document detail.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    const { id } = await context.params;

    verifyDocumentOwnership(id, user.id);

    const doc = documentService.getDocument(id);
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: doc });
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
 * DELETE /api/documents/[id] — Delete a document.
 */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    const { id } = await context.params;

    verifyDocumentOwnership(id, user.id);

    documentService.deleteDocument(id);

    return NextResponse.json({ data: { success: true } });
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
