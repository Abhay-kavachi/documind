import type { RetrievedPage } from '@/lib/types';

/**
 * Abstract document retrieval interface.
 *
 * Production path: ColPaliRetriever (visual page-level retrieval)
 * Fallback: DemoFallbackRetriever (deterministic, explicitly labeled)
 *
 * IMPORTANT: Do NOT implement generic embeddings, TF-IDF, cosine similarity,
 * keyword search, or random vectors and call them "ColPali".
 */
export interface DocumentRetriever {
  /**
   * The retrieval mode identifier.
   * Must be either 'colpali' or 'demo_fallback'.
   */
  readonly mode: string;

  /**
   * Retrieve the most relevant pages for a query.
   *
   * @param query - The user's question
   * @param documentId - The document to search within
   * @param topK - Maximum number of pages to return
   * @returns Ranked list of retrieved pages with scores
   */
  retrieve(_query: string, _documentId: string, _topK: number): Promise<RetrievedPage[]>;
}
