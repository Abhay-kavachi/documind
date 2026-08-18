import type { Citation, RetrievedPage } from '@/lib/types';

/**
 * CitationService — validates and extracts page citations.
 * Ensures citations only reference pages that were actually retrieved.
 */
export const citationService = {
  /**
   * Validate that citations only reference actually retrieved pages.
   */
  validateCitations(citations: Citation[], retrievedPages: RetrievedPage[]): Citation[] {
    const retrievedPageNumbers = new Set(retrievedPages.map(p => p.page_number));
    return citations.filter(c => retrievedPageNumbers.has(c.page_number));
  },

  /**
   * Extract [Page N] references from answer text.
   */
  extractPageNumbers(answer: string): number[] {
    const pageNumbers = new Set<number>();
    const regex = /\[Page\s+(\d+)\]/gi;
    let match;
    while ((match = regex.exec(answer)) !== null) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num)) {
        pageNumbers.add(num);
      }
    }
    return Array.from(pageNumbers).sort((a, b) => a - b);
  },
};
