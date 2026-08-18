import type { DocumentRetriever } from './document-retriever';
import type { RetrievedPage } from '@/lib/types';
import { getDb } from '@/lib/db';
import { logEvent } from '@/lib/logger';
import { DEMO_DOCUMENT_ID, getDemoRetrievalMapping } from '@/lib/demo';

/**
 * DemoFallbackRetriever — Deterministic fallback for demonstration.
 *
 * THIS IS NOT COLPALI. This retriever provides deterministic page
 * selection to enable a functional demo without requiring a ColPali
 * model endpoint, GPU, or paid API credentials.
 *
 * For demo documents: uses pre-configured question→page mappings.
 * For uploaded documents: returns first N pages as a simple fallback.
 *
 * The UI clearly labels this mode as "DEMO FALLBACK" to distinguish
 * it from real ColPali visual retrieval.
 */
export class DemoFallbackRetriever implements DocumentRetriever {
  readonly mode = 'demo_fallback' as const;

  async retrieve(query: string, documentId: string, topK: number): Promise<RetrievedPage[]> {
    logEvent({
      level: 'info',
      event: 'demo_fallback_retrieval_start',
      document_id: documentId,
      details: { top_k: topK, mode: 'demo_fallback' },
    });

    const db = getDb();

    // For demo documents, use pre-configured deterministic mappings
    if (documentId === DEMO_DOCUMENT_ID) {
      const mapping = getDemoRetrievalMapping(query);
      if (mapping) {
        const pages: RetrievedPage[] = mapping.pages
          .slice(0, topK)
          .map((pageNum, idx) => {
            const page = db
              .prepare(
                'SELECT page_number, image_path, text_content FROM pages WHERE document_id = ? AND page_number = ?'
              )
              .get(documentId, pageNum) as
              | { page_number: number; image_path: string; text_content: string | null }
              | undefined;

            if (!page) return null;

            return {
              page_number: page.page_number,
              score: 1.0 - idx * 0.1, // Deterministic descending scores
              image_path: page.image_path,
              text_content: page.text_content,
            };
          })
          .filter((p): p is RetrievedPage => p !== null);

        logEvent({
          level: 'info',
          event: 'demo_fallback_retrieval_complete',
          document_id: documentId,
          details: { retrieved_count: pages.length, mode: 'demo_deterministic' },
        });

        return pages;
      }
    }

    // For uploaded documents or unmatched queries: return pages by order
    // This is an explicit fallback, NOT ColPali retrieval
    const allPages = db
      .prepare(
        'SELECT page_number, image_path, text_content FROM pages WHERE document_id = ? ORDER BY page_number LIMIT ?'
      )
      .all(documentId, topK) as Array<{
      page_number: number;
      image_path: string;
      text_content: string | null;
    }>;

    const pages: RetrievedPage[] = allPages.map((page, idx) => ({
      page_number: page.page_number,
      score: 1.0 - idx * 0.15,
      image_path: page.image_path,
      text_content: page.text_content,
    }));

    logEvent({
      level: 'info',
      event: 'demo_fallback_retrieval_complete',
      document_id: documentId,
      details: { retrieved_count: pages.length, mode: 'demo_sequential' },
    });

    return pages;
  }
}
