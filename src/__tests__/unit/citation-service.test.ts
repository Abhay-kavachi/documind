/**
 * Unit tests for the citation service.
 */

import { describe, it, expect } from 'vitest';

/**
 * Extract page numbers from [Page N] references in answer text.
 */
function extractPageNumbers(answer: string): number[] {
  const regex = /\[Page\s+(\d+)\]/gi;
  const pages: number[] = [];
  let match;

  while ((match = regex.exec(answer)) !== null) {
    const pageNum = parseInt(match[1], 10);
    if (!isNaN(pageNum) && !pages.includes(pageNum)) {
      pages.push(pageNum);
    }
  }

  return pages.sort((a, b) => a - b);
}

/**
 * Validate that citations only reference actually retrieved pages.
 */
function validateCitations(
  citations: Array<{ page_number: number; excerpt: string }>,
  retrievedPageNumbers: number[]
): Array<{ page_number: number; excerpt: string }> {
  return citations.filter(c => retrievedPageNumbers.includes(c.page_number));
}

describe('Citation Service', () => {
  describe('Page Number Extraction', () => {
    it('should extract single page reference', () => {
      const answer = 'The market size is $247B [Page 2].';
      expect(extractPageNumbers(answer)).toEqual([2]);
    });

    it('should extract multiple page references', () => {
      const answer = 'Based on [Page 1] and [Page 4], the ROI is 3.2x [Page 1].';
      expect(extractPageNumbers(answer)).toEqual([1, 4]);
    });

    it('should handle case-insensitive references', () => {
      const answer = 'See [page 3] and [PAGE 5].';
      expect(extractPageNumbers(answer)).toEqual([3, 5]);
    });

    it('should handle no page references', () => {
      const answer = 'The AI market is growing rapidly.';
      expect(extractPageNumbers(answer)).toEqual([]);
    });

    it('should deduplicate page numbers', () => {
      const answer = '[Page 2] shows that [Page 2] confirms the data.';
      expect(extractPageNumbers(answer)).toEqual([2]);
    });

    it('should sort page numbers', () => {
      const answer = '[Page 5] [Page 1] [Page 3]';
      expect(extractPageNumbers(answer)).toEqual([1, 3, 5]);
    });
  });

  describe('Citation Validation', () => {
    it('should keep citations that match retrieved pages', () => {
      const citations = [
        { page_number: 1, excerpt: 'Key finding' },
        { page_number: 4, excerpt: 'Cost analysis' },
      ];
      const retrievedPages = [1, 2, 4];

      const valid = validateCitations(citations, retrievedPages);
      expect(valid).toHaveLength(2);
    });

    it('should filter out citations for non-retrieved pages', () => {
      const citations = [
        { page_number: 1, excerpt: 'Key finding' },
        { page_number: 7, excerpt: 'Recommendation' }, // Not in retrieved pages
      ];
      const retrievedPages = [1, 2, 3];

      const valid = validateCitations(citations, retrievedPages);
      expect(valid).toHaveLength(1);
      expect(valid[0].page_number).toBe(1);
    });

    it('should return empty array when no citations match', () => {
      const citations = [
        { page_number: 5, excerpt: 'Risk' },
        { page_number: 6, excerpt: 'Architecture' },
      ];
      const retrievedPages = [1, 2, 3];

      const valid = validateCitations(citations, retrievedPages);
      expect(valid).toHaveLength(0);
    });

    it('should handle empty citations', () => {
      const valid = validateCitations([], [1, 2, 3]);
      expect(valid).toHaveLength(0);
    });

    it('should handle empty retrieved pages', () => {
      const citations = [{ page_number: 1, excerpt: 'Data' }];
      const valid = validateCitations(citations, []);
      expect(valid).toHaveLength(0);
    });
  });
});
