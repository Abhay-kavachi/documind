import type { LLMResponse, RetrievedPage } from '@/lib/types';

/**
 * Abstract LLM provider interface.
 *
 * Production: GeminiProvider (Google Gemini multimodal API)
 * Fallback: DemoLLMProvider (deterministic pre-computed answers)
 *
 * The provider receives retrieved page images and text as evidence,
 * with strict delimiter separation from system instructions.
 */
export interface LLMProvider {
  /**
   * The provider identifier.
   */
  readonly provider: string;

  /**
   * Generate a grounded answer from retrieved page evidence.
   *
   * @param question - The user's question (untrusted input)
   * @param retrievedPages - Pages retrieved by the DocumentRetriever
   * @param documentTitle - Title of the document being queried
   * @returns Structured response with answer, citations, confidence
   */
  generateAnswer(
    _question: string,
    _retrievedPages: RetrievedPage[],
    _documentTitle: string
  ): Promise<LLMResponse>;
}
