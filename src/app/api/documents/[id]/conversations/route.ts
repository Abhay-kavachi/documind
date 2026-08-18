import { NextResponse } from 'next/server';
import { getSessionUser, verifyDocumentOwnership, AuthorizationError } from '@/lib/auth';
import { conversationService } from '@/lib/services/conversation-service';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/documents/[id]/conversations — List conversations for a document.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    const { id } = await context.params;

    verifyDocumentOwnership(id, user.id);

    const conversations = conversationService.getDocumentConversations(id, user.id);

    return NextResponse.json({ data: conversations });
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
