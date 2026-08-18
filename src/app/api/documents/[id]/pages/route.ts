import { NextResponse } from 'next/server';
import { getSessionUser, verifyDocumentOwnership, AuthorizationError } from '@/lib/auth';
import { getDb } from '@/lib/db';
import type { PageRecord } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/[id]/pages — List pages for a document.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    const { id } = await context.params;

    verifyDocumentOwnership(id, user.id);

    const db = getDb();
    const pages = db
      .prepare('SELECT * FROM pages WHERE document_id = ? ORDER BY page_number')
      .all(id) as PageRecord[];

    return NextResponse.json({ data: pages });
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
