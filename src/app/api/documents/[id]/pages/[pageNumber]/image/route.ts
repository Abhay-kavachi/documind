import { NextResponse } from 'next/server';
import { getSessionUser, verifyDocumentOwnership, AuthorizationError } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { readFile } from '@/lib/storage';

type RouteContext = { params: Promise<{ id: string; pageNumber: string }> };

/**
 * GET /api/documents/[id]/pages/[pageNumber]/image — Serve page image.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    const { id, pageNumber } = await context.params;

    verifyDocumentOwnership(id, user.id);

    const pageNum = parseInt(pageNumber, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json(
        { error: 'Invalid page number', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const db = getDb();
    const page = db
      .prepare('SELECT image_path FROM pages WHERE document_id = ? AND page_number = ?')
      .get(id, pageNum) as { image_path: string } | undefined;

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const imageBuffer = readFile(page.image_path);

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: error.statusCode }
      );
    }
    if (error instanceof Error && error.message === 'File not found') {
      return NextResponse.json(
        { error: 'Page image not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
