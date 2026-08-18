import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import type { SessionUser } from '@/lib/types';

const COOKIE_NAME = 'documind_session';
const DEMO_USER_ID = 'demo-user-001';

/**
 * Get the session secret for signing cookies.
 * Falls back to a development-only secret if not configured.
 */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  return secret || 'dev-only-documind-session-secret-do-not-use-in-production';
}

/**
 * Sign a value using HMAC-SHA256.
 */
function sign(value: string): string {
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('hex');
  return `${value}.${signature}`;
}

/**
 * Verify a signed value. Returns null if invalid.
 */
function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return null;

  const value = signed.substring(0, lastDot);
  const expectedSignature = crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('hex');

  const actualSignature = signed.substring(lastDot + 1);

  // Constant-time comparison to prevent timing attacks
  if (actualSignature.length !== expectedSignature.length) return null;
  const valid = crypto.timingSafeEqual(
    Buffer.from(actualSignature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );

  return valid ? value : null;
}

/**
 * Ensure the demo user exists in the database.
 */
function ensureDemoUser(): void {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(DEMO_USER_ID);
  if (!existing) {
    db.prepare('INSERT INTO users (id, role) VALUES (?, ?)').run(DEMO_USER_ID, 'user');
  }
}

/**
 * Get the current session user from the signed cookie.
 * If no valid session exists, creates a demo session.
 * Returns the user — never trusts a raw client-supplied ID.
 */
export async function getSessionUser(): Promise<SessionUser> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (sessionCookie?.value) {
    const userId = verify(sessionCookie.value);
    if (userId) {
      const db = getDb();
      const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId) as
        | { id: string; role: string }
        | undefined;
      if (user) {
        return { id: user.id, role: user.role };
      }
    }
  }

  // No valid session — create demo session
  ensureDemoUser();

  // Set signed cookie
  const signedValue = sign(DEMO_USER_ID);
  cookieStore.set(COOKIE_NAME, signedValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { id: DEMO_USER_ID, role: 'user' };
}

/**
 * Verify document ownership. Throws if unauthorized.
 */
export function verifyDocumentOwnership(documentId: string, userId: string): void {
  const db = getDb();
  const doc = db
    .prepare('SELECT owner_id FROM documents WHERE id = ?')
    .get(documentId) as { owner_id: string } | undefined;

  if (!doc) {
    throw new AuthorizationError('Document not found', 404);
  }
  if (doc.owner_id !== userId) {
    throw new AuthorizationError('Access denied', 403);
  }
}

/**
 * Verify conversation ownership. Throws if unauthorized.
 */
export function verifyConversationOwnership(conversationId: string, userId: string): void {
  const db = getDb();
  const conv = db
    .prepare('SELECT owner_id FROM conversations WHERE id = ?')
    .get(conversationId) as { owner_id: string } | undefined;

  if (!conv) {
    throw new AuthorizationError('Conversation not found', 404);
  }
  if (conv.owner_id !== userId) {
    throw new AuthorizationError('Access denied', 403);
  }
}

/**
 * Custom error class for authorization failures.
 */
export class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 403) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
  }
}
