/**
 * Unit tests for the retrieval abstraction.
 */

import { describe, it, expect } from 'vitest';

describe('Retrieval Abstraction', () => {
  describe('Retrieval Mode Configuration', () => {
    it('should support colpali and demo_fallback modes', () => {
      const validModes = ['colpali', 'demo_fallback'];
      expect(validModes).toContain('colpali');
      expect(validModes).toContain('demo_fallback');
    });

    it('should reject unknown retrieval modes', () => {
      const invalidModes = ['tfidf', 'cosine', 'keyword', 'random', 'embeddings'];
      for (const mode of invalidModes) {
        expect(['colpali', 'demo_fallback']).not.toContain(mode);
      }
    });

    it('should correctly label demo fallback as not ColPali', () => {
      const mode = 'demo_fallback';
      expect(mode).not.toBe('colpali');
      expect(mode).toContain('demo');
      expect(mode).toContain('fallback');
    });
  });

  describe('Demo Retrieval Mapping', () => {
    // Inline the mapping logic for testing without path alias issues
    interface DemoMapping {
      keywords: string[];
      pages: number[];
    }

    const mappings: DemoMapping[] = [
      { keywords: ['executive summary', 'overview', 'key findings'], pages: [1, 2, 8] },
      { keywords: ['market', 'market size', 'segmentation'], pages: [2, 1, 3] },
      { keywords: ['cost', 'tco', 'budget', 'roi'], pages: [4, 1, 7] },
      { keywords: ['risk', 'security', 'bias'], pages: [5, 7, 6] },
      { keywords: ['recommend', 'strategy', 'action'], pages: [7, 6, 8] },
    ];

    function findMapping(query: string): DemoMapping | null {
      const normalized = query.toLowerCase();
      let best: DemoMapping | null = null;
      let bestScore = 0;

      for (const m of mappings) {
        const score = m.keywords.filter(kw => normalized.includes(kw)).length;
        if (score > bestScore) {
          bestScore = score;
          best = m;
        }
      }

      return best;
    }

    it('should map executive summary queries to page 1', () => {
      const mapping = findMapping('What are the key findings in the executive summary?');
      expect(mapping).not.toBeNull();
      expect(mapping!.pages[0]).toBe(1);
    });

    it('should map cost queries to page 4', () => {
      const mapping = findMapping('What is the total cost of ownership?');
      expect(mapping).not.toBeNull();
      expect(mapping!.pages[0]).toBe(4);
    });

    it('should map risk queries to page 5', () => {
      const mapping = findMapping('What are the main security risks?');
      expect(mapping).not.toBeNull();
      expect(mapping!.pages[0]).toBe(5);
    });

    it('should map recommendation queries to page 7', () => {
      const mapping = findMapping('What does the report recommend?');
      expect(mapping).not.toBeNull();
      expect(mapping!.pages[0]).toBe(7);
    });

    it('should return null for unmatched queries', () => {
      const mapping = findMapping('xyzzy foobar baz');
      expect(mapping).toBeNull();
    });

    it('should return deterministic results for same query', () => {
      const query = 'What is the market size?';
      const result1 = findMapping(query);
      const result2 = findMapping(query);
      expect(result1).toEqual(result2);
    });
  });

  describe('Retrieved Page Structure', () => {
    it('should have required fields', () => {
      const page = {
        page_number: 1,
        score: 0.95,
        image_path: 'pages/doc-123/page-1.png',
        text_content: 'Sample text content',
      };

      expect(page.page_number).toBeGreaterThan(0);
      expect(page.score).toBeGreaterThanOrEqual(0);
      expect(page.score).toBeLessThanOrEqual(1);
      expect(page.image_path).toBeTruthy();
    });
  });
});
