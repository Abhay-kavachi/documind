import type { DocumentRetriever } from './document-retriever';
import type { RetrievalMode } from '@/lib/types';
import { ColPaliRetriever } from './colpali-retriever';
import { DemoFallbackRetriever } from './demo-fallback-retriever';

export type { DocumentRetriever } from './document-retriever';

/**
 * Factory: create the configured retriever.
 *
 * Modes:
 *   'colpali'        — Real ColPali visual retrieval (requires COLPALI_ENDPOINT)
 *   'demo_fallback'  — Deterministic demo retrieval (no external dependencies)
 */
export function createRetriever(mode?: RetrievalMode): DocumentRetriever {
  const resolvedMode = mode || (process.env.RETRIEVAL_MODE as RetrievalMode) || 'demo_fallback';

  switch (resolvedMode) {
    case 'colpali':
      return new ColPaliRetriever();
    case 'demo_fallback':
      return new DemoFallbackRetriever();
    default:
      throw new Error(`Unknown retrieval mode: ${resolvedMode}. Use 'colpali' or 'demo_fallback'.`);
  }
}

/**
 * Get the current retrieval mode label for display.
 */
export function getRetrievalModeLabel(): { mode: RetrievalMode; label: string; isDemo: boolean } {
  const mode = (process.env.RETRIEVAL_MODE as RetrievalMode) || 'demo_fallback';

  if (mode === 'colpali') {
    return { mode, label: 'ColPali Visual Retrieval', isDemo: false };
  }
  return { mode, label: 'Demo Fallback (not ColPali)', isDemo: true };
}
