import type { DocumentRetriever } from './document-retriever';
import type { RetrievedPage } from '@/lib/types';
import { logEvent } from '@/lib/logger';

/**
 * ColPaliRetriever — Production visual document retrieval.
 *
 * ColPali uses a vision-language model to create multi-vector embeddings
 * of document page images, enabling retrieval based on visual content
 * (tables, charts, layout) rather than just extracted text.
 *
 * REQUIREMENTS FOR REAL COLPALI MODE:
 * 1. A running ColPali model endpoint (e.g., colpali-v1.2 served via colpali-engine)
 * 2. GPU with at least 8GB VRAM for inference
 * 3. Set RETRIEVAL_MODE=colpali and COLPALI_ENDPOINT=<url> in environment
 *
 * When the ColPali endpoint is not available, the application falls back
 * to DemoFallbackRetriever (explicitly labeled as demo_fallback).
 *
 * This class is the REAL ColPali adapter — it calls an actual ColPali
 * model for visual embedding and retrieval. It does NOT use TF-IDF,
 * cosine similarity on text embeddings, keyword search, or random vectors.
 */
export class ColPaliRetriever implements DocumentRetriever {
  readonly mode = 'colpali' as const;
  private endpoint: string;

  constructor() {
    const endpoint = process.env.COLPALI_ENDPOINT;
    if (!endpoint) {
      throw new Error(
        'COLPALI_ENDPOINT is required when RETRIEVAL_MODE=colpali. ' +
        'Set up a ColPali model server (e.g., colpali-engine) and provide the endpoint URL. ' +
        'For development without a ColPali server, use RETRIEVAL_MODE=demo_fallback.'
      );
    }
    this.endpoint = endpoint;
  }

  async retrieve(query: string, documentId: string, topK: number): Promise<RetrievedPage[]> {
    logEvent({
      level: 'info',
      event: 'colpali_retrieval_start',
      document_id: documentId,
      details: { top_k: topK, endpoint: this.endpoint },
    });

    try {
      // Call the ColPali model endpoint for visual retrieval
      const response = await fetch(`${this.endpoint}/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          document_id: documentId,
          top_k: topK,
        }),
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (!response.ok) {
        throw new Error(`ColPali endpoint returned ${response.status}: ${response.statusText}`);
      }

      const result = await response.json() as { pages: RetrievedPage[] };

      logEvent({
        level: 'info',
        event: 'colpali_retrieval_complete',
        document_id: documentId,
        details: { retrieved_count: result.pages.length },
      });

      return result.pages;
    } catch (error) {
      logEvent({
        level: 'error',
        event: 'colpali_retrieval_error',
        document_id: documentId,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
      throw error;
    }
  }
}
