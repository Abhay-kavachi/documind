import type { LLMProvider } from './llm-provider';
import type { LLMResponse, RetrievedPage } from '@/lib/types';
import { getDemoAnswer } from '@/lib/demo';
import { logEvent } from '@/lib/logger';

/**
 * DemoLLMProvider — Deterministic pre-computed answers for demo mode.
 *
 * Returns pre-configured answers for demo document questions,
 * and generates simple template-based answers for uploaded documents.
 *
 * This is NOT a real LLM — it's a deterministic fallback that allows
 * the application to be fully functional without paid API credentials.
 */
export class DemoLLMProvider implements LLMProvider {
  readonly provider = 'demo' as const;

  async generateAnswer(
    question: string,
    retrievedPages: RetrievedPage[],
    documentTitle: string
  ): Promise<LLMResponse> {
    logEvent({
      level: 'info',
      event: 'demo_llm_generation',
      details: { page_count: retrievedPages.length, mode: 'demo' },
    });

    // Check if there's a pre-configured demo answer
    const demoAnswer = getDemoAnswer(question);
    if (demoAnswer) {
      return demoAnswer;
    }

    // For non-demo questions, generate a template-based answer
    // that references the retrieved pages
    const pageNumbers = retrievedPages.map(p => p.page_number);
    const citations = retrievedPages.slice(0, 3).map(p => ({
      page_number: p.page_number,
      excerpt: p.text_content
        ? p.text_content.substring(0, 150) + '...'
        : `Content from page ${p.page_number}`,
    }));

    const pageCitations = pageNumbers.map(p => `[Page ${p}]`).join(', ');

    return {
      answer: `Based on the analysis of "${documentTitle}", the retrieved evidence from ${pageCitations} provides relevant information about your question. ` +
        `This is a demo response — for production-quality grounded answers with real multimodal analysis, ` +
        `configure a Gemini API key (LLM_PROVIDER=gemini).`,
      citations,
      confidence: 0.5,
      provenance: `Demo mode: template response based on pages ${pageNumbers.join(', ')}. Not a real LLM analysis.`,
    };
  }
}
