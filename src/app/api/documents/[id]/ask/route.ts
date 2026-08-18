import { NextResponse } from 'next/server';
import { getSessionUser, verifyDocumentOwnership, AuthorizationError } from '@/lib/auth';
import { answerGenerator } from '@/lib/services/answer-generator';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/documents/[id]/ask — Ask a question about a document.
 * Body: { question: string }
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    const { id } = await context.params;

    verifyDocumentOwnership(id, user.id);

    const body = await request.json();
    const { question } = body as { question?: string };

    // Validate question
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Question cannot be empty', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    if (trimmedQuestion.length > 2000) {
      return NextResponse.json(
        { error: 'Question exceeds maximum length of 2000 characters', code: 'BAD_REQUEST' },
        { status: 400 }
      );
    }

    // Generate answer (question is treated as DATA, never as instructions)
    const result = await answerGenerator.generateAnswer(trimmedQuestion, id, user.id);

    return NextResponse.json({ data: result });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: 'UNAUTHORIZED' },
        { status: error.statusCode }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to generate answer';
    return NextResponse.json(
      { error: message, code: 'GENERATION_ERROR' },
      { status: 500 }
    );
  }
}
