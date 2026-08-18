// ─── DocuMind Core Types ───
// Central type definitions shared across all layers

// ─── Document ───

export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type DocumentSource = 'upload' | 'demo';

export interface DocumentRecord {
  id: string;
  owner_id: string;
  title: string;
  file_name: string;
  storage_key: string;
  source: DocumentSource;
  status: DocumentStatus;
  num_pages: number;
  doc_type: string;
  summary: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Page ───

export interface PageRecord {
  id: string;
  document_id: string;
  page_number: number;
  section_title: string | null;
  text_content: string | null;
  image_path: string;
  created_at: string;
}

// ─── Conversation ───

export type ConversationStatus = 'completed' | 'error';

export interface Citation {
  page_number: number;
  excerpt: string;
}

export interface ConversationRecord {
  id: string;
  document_id: string;
  owner_id: string;
  question: string;
  answer: string;
  citations: Citation[];
  retrieved_pages: number[];
  confidence: number;
  provenance: string;
  retrieval_mode: string;
  status: ConversationStatus;
  created_at: string;
}

// ─── Retrieval ───

export interface RetrievedPage {
  page_number: number;
  score: number;
  image_path: string;
  text_content: string | null;
}

export type RetrievalMode = 'colpali' | 'demo_fallback';

// ─── LLM ───

export interface LLMResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
  provenance: string;
}

export type LLMProviderType = 'gemini' | 'demo';

// ─── API ───

export interface ApiError {
  error: string;
  code: string;
  details?: string;
}

export interface ApiSuccess<T> {
  data: T;
}

// ─── Auth ───

export interface SessionUser {
  id: string;
  role: string;
}

// ─── Structured Logging ───

export interface LogEvent {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  event: string;
  document_id?: string;
  user_id?: string;
  duration_ms?: number;
  details?: Record<string, unknown>;
}
