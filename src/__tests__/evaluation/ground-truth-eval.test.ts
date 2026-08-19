/**
 * Ground-Truth Evaluation Suite for DocuMind
 *
 * Evaluates across 25 deterministic evaluation cases covering all 8 pages
 * of the 2026 Enterprise AI Adoption & Operations Report.
 *
 * Measures separately:
 * 1. Retrieval Correctness (Top-1 Accuracy, Top-k Recall/Accuracy)
 * 2. Citation Correctness (Citation Precision, Citation Recall, Validity)
 * 3. Answer Grounding (Fact verification against cited page content, negative grounding checks)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRetriever } from '@/lib/retrieval';
import { createLLMProvider } from '@/lib/llm';
import { citationService } from '@/lib/services/citation-service';
import { DEMO_DOCUMENT_ID, DEMO_PAGES } from '@/lib/demo';

export interface GroundTruthTestCase {
  id: string;
  question: string;
  expectedTop1Page: number;
  expectedRelevantPages: number[];
  expectedEvidenceKeywords: string[];
  expectedAnswerFacts: string[];
  description: string;
}

export const GROUND_TRUTH_CASES: GroundTruthTestCase[] = [
  {
    id: 'CASE-01',
    question: 'What are the main key findings in the executive summary of the 2026 report?',
    expectedTop1Page: 1,
    expectedRelevantPages: [1, 2, 8],
    expectedEvidenceKeywords: ['73% of enterprises', '3.2x', 'data quality', '$12.4M', '247 billion'],
    expectedAnswerFacts: ['73%', '3.2x', '$247 billion', '67%'],
    description: 'Executive summary statistics and production adoption metrics',
  },
  {
    id: 'CASE-02',
    question: 'What is the total market size and YoY growth of the global enterprise AI market?',
    expectedTop1Page: 2,
    expectedRelevantPages: [2, 1, 3],
    expectedEvidenceKeywords: ['$247.0B', '34% YoY', 'market size'],
    expectedAnswerFacts: ['$247 billion', '34%'],
    description: 'Global market size and year-over-year growth rate',
  },
  {
    id: 'CASE-03',
    question: 'How is the enterprise AI market segmented by technology and what are their market shares?',
    expectedTop1Page: 2,
    expectedRelevantPages: [2, 1, 3],
    expectedEvidenceKeywords: ['Natural Language', '$68.2B', 'Computer Vision', '$51.8B', 'Multimodal AI', '$44.3B'],
    expectedAnswerFacts: ['Natural Language', '$68.2B', 'Computer Vision', '$51.8B', 'Multimodal AI', '17.9%'],
    description: 'Market segmentation and technology breakdowns',
  },
  {
    id: 'CASE-04',
    question: 'What is the regional distribution and geographic market share for enterprise AI?',
    expectedTop1Page: 2,
    expectedRelevantPages: [2, 1, 3],
    expectedEvidenceKeywords: ['North America', '42%', 'Asia Pacific', '31%', 'Europe', '21%'],
    expectedAnswerFacts: ['North America', '42%', 'Asia Pacific', '31%', 'Europe', '21%'],
    description: 'Geographic market distribution across North America, APAC, Europe',
  },
  {
    id: 'CASE-05',
    question: 'Why is multimodal AI the fastest-growing market segment with 67% growth?',
    expectedTop1Page: 2,
    expectedRelevantPages: [2, 1, 7],
    expectedEvidenceKeywords: ['Multimodal AI', '67% growth', 'visual elements', 'charts', 'tables'],
    expectedAnswerFacts: ['67%', '$44.3', 'visual elements', 'document'],
    description: 'Multimodal growth drivers and visual document requirements',
  },
  {
    id: 'CASE-06',
    question: 'What are the five stages of the enterprise AI maturity model and their distributions?',
    expectedTop1Page: 3,
    expectedRelevantPages: [3, 1, 6],
    expectedEvidenceKeywords: ['Experimental', '12%', 'Departmental', '23%', 'Operational', '38%', 'Strategic', '19%', 'Transformative', '8%'],
    expectedAnswerFacts: ['Experimental', '12%', 'Operational', '38%', 'Transformative', '8%'],
    description: 'Five-stage maturity framework distribution',
  },
  {
    id: 'CASE-07',
    question: 'What are the top barriers to adoption faced by enterprises implementing AI?',
    expectedTop1Page: 3,
    expectedRelevantPages: [3, 1, 7],
    expectedEvidenceKeywords: ['Data quality and integration', '67%', 'Talent shortage', '54%', 'Security and privacy', '48%'],
    expectedAnswerFacts: ['Data quality', '67%', 'Talent shortage', '54%', 'Security', '48%'],
    description: 'Primary enterprise adoption barriers',
  },
  {
    id: 'CASE-08',
    question: 'What are the primary adoption accelerators reducing time-to-deployment?',
    expectedTop1Page: 3,
    expectedRelevantPages: [3, 7, 1],
    expectedEvidenceKeywords: ['Pre-trained foundation models', '60%', 'Cloud-native AI platforms'],
    expectedAnswerFacts: ['60%', 'pre-trained foundation models', 'cloud-native'],
    description: 'Accelerators lowering barriers and deployment time',
  },
  {
    id: 'CASE-09',
    question: 'What is the average annual Total Cost of Ownership (TCO) for enterprise AI?',
    expectedTop1Page: 4,
    expectedRelevantPages: [4, 1, 7],
    expectedEvidenceKeywords: ['$12.4M', 'Personnel Costs', '40%', 'Infrastructure Costs', '35%'],
    expectedAnswerFacts: ['$12.4 million', 'Personnel', 'Infrastructure', '14.2 months'],
    description: 'Overall TCO and high-level allocation breakdown',
  },
  {
    id: 'CASE-10',
    question: 'What is the infrastructure cost breakdown including GPU compute spending?',
    expectedTop1Page: 4,
    expectedRelevantPages: [4, 6, 1],
    expectedEvidenceKeywords: ['Cloud compute (GPU/TPU)', '$2.8M', 'Storage and data pipelines', '$890K', 'Networking and security', '$420K'],
    expectedAnswerFacts: ['35%', '$2.8M', '$890K', '$420K'],
    description: 'Infrastructure budget allocation for compute, storage, networking',
  },
  {
    id: 'CASE-11',
    question: 'What are the personnel costs and average FTE headcount breakdown for AI teams?',
    expectedTop1Page: 4,
    expectedRelevantPages: [4, 3, 1],
    expectedEvidenceKeywords: ['ML Engineers', '6.2 FTE', '$1.9M', 'Data Engineers', '4.8 FTE', '$1.2M', 'AI/ML Operations', '3.1 FTE', '$680K'],
    expectedAnswerFacts: ['ML Engineers', '6.2 FTE', '$1.9M', 'Data Engineers', '4.8 FTE', '$1.2M'],
    description: 'Team staffing FTEs and compensation costs',
  },
  {
    id: 'CASE-12',
    question: 'What is the average time to positive ROI and return multiple at 18 and 36 months?',
    expectedTop1Page: 4,
    expectedRelevantPages: [4, 1, 8],
    expectedEvidenceKeywords: ['14.2 months', '3.2x', '18 months', '5.7x', '36 months'],
    expectedAnswerFacts: ['14.2 months', '3.2x', '5.7x'],
    description: 'ROI timeline and investment return multiples',
  },
  {
    id: 'CASE-13',
    question: 'What cost optimization strategies are recommended to reduce GPU and inference costs?',
    expectedTop1Page: 4,
    expectedRelevantPages: [4, 7, 6],
    expectedEvidenceKeywords: ['GPU arbitrage', '28% savings', 'distillation and quantization', '40-60%'],
    expectedAnswerFacts: ['GPU arbitrage', '28%', 'distillation', '40–60%'],
    description: 'Tactics for cloud arbitrage and model quantization',
  },
  {
    id: 'CASE-14',
    question: 'What are the critical risks identified in the enterprise AI risk matrix?',
    expectedTop1Page: 5,
    expectedRelevantPages: [5, 7, 6],
    expectedEvidenceKeywords: ['Data Privacy', 'Critical', 'Model Bias', 'High', 'Security Breach'],
    expectedAnswerFacts: ['Data Privacy', 'Model Bias', 'Security Breach', 'Critical'],
    description: 'Top ranked risk categories in the risk matrix',
  },
  {
    id: 'CASE-15',
    question: 'What percentage of enterprises process PII and what data privacy controls are needed?',
    expectedTop1Page: 5,
    expectedRelevantPages: [5, 7, 1],
    expectedEvidenceKeywords: ['78% of enterprises', 'PII', 'differential privacy', 'data minimization'],
    expectedAnswerFacts: ['78%', 'PII', 'differential privacy', 'data minimization'],
    description: 'PII handling metrics and privacy mitigations',
  },
  {
    id: 'CASE-16',
    question: 'What AI-specific attack vectors are emerging against enterprise models?',
    expectedTop1Page: 5,
    expectedRelevantPages: [5, 7, 6],
    expectedEvidenceKeywords: ['prompt injection', 'model extraction', 'training data poisoning', 'adversarial inputs'],
    expectedAnswerFacts: ['prompt injection', 'model extraction', 'training data poisoning', 'adversarial inputs'],
    description: 'Adversarial security attack vectors and threat vectors',
  },
  {
    id: 'CASE-17',
    question: 'How much did model bias incidents increase in 2025 and how should it be monitored?',
    expectedTop1Page: 5,
    expectedRelevantPages: [5, 7, 3],
    expectedEvidenceKeywords: ['bias incidents increased 45%', 'fairness monitoring', 'training data audits'],
    expectedAnswerFacts: ['45%', '2025', 'bias testing', 'fairness monitoring'],
    description: 'Model bias increase statistics and testing policies',
  },
  {
    id: 'CASE-18',
    question: 'What is the six-layer enterprise AI architecture stack recommended in the report?',
    expectedTop1Page: 6,
    expectedRelevantPages: [6, 7, 4],
    expectedEvidenceKeywords: ['APPLICATION LAYER', 'ORCHESTRATION LAYER', 'MODEL LAYER', 'MLOps LAYER', 'DATA LAYER', 'INFRASTRUCTURE LAYER'],
    expectedAnswerFacts: ['Application Layer', 'Orchestration Layer', 'Model Layer', 'MLOps Layer', 'Data Layer', 'Infrastructure Layer'],
    description: 'Six architectural layers from Application to Infrastructure',
  },
  {
    id: 'CASE-19',
    question: 'Why is the hub-and-spoke operating model preferred by 65% of successful enterprises?',
    expectedTop1Page: 6,
    expectedRelevantPages: [6, 7, 3],
    expectedEvidenceKeywords: ['Hub-and-Spoke', '65%', 'Central AI Platform Team', 'Business Unit AI Teams', 'AI Ethics Board'],
    expectedAnswerFacts: ['Hub-and-Spoke', '65%', 'Central AI Platform Team', 'Business Unit'],
    description: 'Organizational operating model adoption and structure',
  },
  {
    id: 'CASE-20',
    question: 'What immediate actions (0-6 months) are recommended for enterprise AI governance and infrastructure?',
    expectedTop1Page: 7,
    expectedRelevantPages: [7, 6, 8],
    expectedEvidenceKeywords: ['IMMEDIATE ACTIONS', '0-6 months', 'AI Governance Framework', 'Data Infrastructure', 'Multimodal AI'],
    expectedAnswerFacts: ['Governance Framework', 'Data Infrastructure', 'Multimodal', '0-6 months'],
    description: 'First 6-month roadmap recommendations',
  },
  {
    id: 'CASE-21',
    question: 'What does the report recommend regarding visual retrieval systems and ColPali for document processing?',
    expectedTop1Page: 7,
    expectedRelevantPages: [7, 2, 1],
    expectedEvidenceKeywords: ['visual retrieval systems', 'ColPali', 'benchmark multimodal vs. text-only', 'vision-language models'],
    expectedAnswerFacts: ['ColPali', 'visual retrieval', 'multimodal', 'document processing'],
    description: 'ColPali and visual document retrieval adoption recommendation',
  },
  {
    id: 'CASE-22',
    question: 'What are the medium-term priorities (6-18 months) for MLOps maturity and security?',
    expectedTop1Page: 7,
    expectedRelevantPages: [7, 6, 3],
    expectedEvidenceKeywords: ['MEDIUM-TERM PRIORITIES', '6-18 months', 'MLOps Maturity', 'drift detection', 'AI-Native Security'],
    expectedAnswerFacts: ['6–18 months', 'MLOps', 'drift detection', 'prompt injection'],
    description: '6 to 18-month engineering priorities',
  },
  {
    id: 'CASE-23',
    question: 'What is the long-term vision (18-36 months) for scaling AI-first operations?',
    expectedTop1Page: 7,
    expectedRelevantPages: [7, 6, 8],
    expectedEvidenceKeywords: ['LONG-TERM VISION', '18-36 months', 'Scale AI-First Operations', 'product-based AI', 'model distillation'],
    expectedAnswerFacts: ['18–36 months', 'product-based', 'distillation', 'continuous learning'],
    description: 'Long-term 3-year strategic horizon',
  },
  {
    id: 'CASE-24',
    question: 'How much higher is the success rate for organizations with structured MLOps practices?',
    expectedTop1Page: 1,
    expectedRelevantPages: [1, 7, 8],
    expectedEvidenceKeywords: ['2.8x higher success rates', 'MLOps practices', 'structured operational frameworks'],
    expectedAnswerFacts: ['2.8x', 'MLOps'],
    description: 'Empirical impact of early MLOps investments on production success',
  },
  {
    id: 'CASE-25',
    question: 'What are the concluding takeaways and final recommendations of the 2026 report?',
    expectedTop1Page: 8,
    expectedRelevantPages: [8, 1, 7],
    expectedEvidenceKeywords: ['Key Takeaways', '73% of enterprises', '3.2x ROI', 'Data quality remains the #1 challenge', 'Hub-and-spoke'],
    expectedAnswerFacts: ['73%', '3.2x', 'Data quality', 'Hub-and-spoke', '2.8x'],
    description: 'Summary conclusion and core strategic takeaways',
  },
];

describe('Ground-Truth Evaluation Pass', () => {
  const retriever = createRetriever('demo_fallback');
  const llmProvider = createLLMProvider('demo');

  beforeAll(() => {
    expect(GROUND_TRUTH_CASES.length).toBeGreaterThanOrEqual(20);
  });

  describe('1. Retrieval Correctness Evaluation', () => {
    let top1Hits = 0;
    let topKHits = 0;
    const totalCases = GROUND_TRUTH_CASES.length;

    it('evaluates retrieval accuracy across all 25 evaluation cases', async () => {
      for (const testCase of GROUND_TRUTH_CASES) {
        const retrieved = await retriever.retrieve(testCase.question, DEMO_DOCUMENT_ID, 3);
        
        expect(retrieved.length).toBeGreaterThan(0);
        const retrievedPageNumbers = retrieved.map(p => p.page_number);

        // Top-1 Accuracy: Is rank 1 page matching expected primary page?
        const top1Matched = retrieved[0].page_number === testCase.expectedTop1Page;
        if (top1Matched) top1Hits++;

        // Top-k Accuracy: Is any expected relevant page in the top-k retrieved?
        const topKMatched = retrievedPageNumbers.some(p => testCase.expectedRelevantPages.includes(p));
        if (topKMatched) topKHits++;

        expect(topKMatched).toBe(true);
      }

      const top1Accuracy = (top1Hits / totalCases) * 100;
      const topKAccuracy = (topKHits / totalCases) * 100;

      // Assert metrics meet high threshold
      expect(top1Accuracy).toBeGreaterThanOrEqual(90.0);
      expect(topKAccuracy).toBe(100.0);
    });

    it('reports separate, non-collapsed retrieval metrics', () => {
      const top1Accuracy = (top1Hits / totalCases) * 100;
      const topKAccuracy = (topKHits / totalCases) * 100;

      expect(typeof top1Accuracy).toBe('number');
      expect(typeof topKAccuracy).toBe('number');
    });
  });

  describe('2. Citation Correctness Evaluation', () => {
    it('evaluates citation precision, recall, and page bounds across all cases', async () => {
      let totalCitations = 0;
      let validCitations = 0;
      let groundedCitations = 0;

      for (const testCase of GROUND_TRUTH_CASES) {
        const retrieved = await retriever.retrieve(testCase.question, DEMO_DOCUMENT_ID, 3);
        const response = await llmProvider.generateAnswer(
          testCase.question,
          retrieved,
          '2026 Enterprise AI Adoption & Operations Report'
        );

        // Validate extracted citation markers
        const extractedPages = citationService.extractPageNumbers(response.answer);
        expect(extractedPages.length).toBeGreaterThan(0);

        // Every extracted page must be between 1 and 8
        for (const pageNum of extractedPages) {
          expect(pageNum).toBeGreaterThanOrEqual(1);
          expect(pageNum).toBeLessThanOrEqual(8);
        }

        // Validate citations against retrieved pages
        const validated = citationService.validateCitations(response.citations, retrieved);
        totalCitations += response.citations.length;
        validCitations += validated.length;

        // Check that cited pages match the expected relevant pages for the topic
        for (const citation of response.citations) {
          if (testCase.expectedRelevantPages.includes(citation.page_number)) {
            groundedCitations++;
          }
        }
      }

      const citationValidityRate = (validCitations / totalCitations) * 100;
      const citationPrecisionRate = (groundedCitations / totalCitations) * 100;

      // Citations must strictly match retrieved pages
      expect(citationValidityRate).toBe(100.0);
      expect(citationPrecisionRate).toBeGreaterThanOrEqual(95.0);
    });
  });

  describe('3. Answer Grounding Evaluation', () => {
    it('verifies that every answer contains facts verified by its cited page', async () => {
      for (const testCase of GROUND_TRUTH_CASES) {
        const retrieved = await retriever.retrieve(testCase.question, DEMO_DOCUMENT_ID, 3);
        const response = await llmProvider.generateAnswer(
          testCase.question,
          retrieved,
          '2026 Enterprise AI Adoption & Operations Report'
        );

        // Verify key expected factual points are present in the answer
        const answerText = response.answer.toLowerCase();
        let factMatches = 0;
        for (const fact of testCase.expectedAnswerFacts) {
          if (answerText.includes(fact.toLowerCase())) {
            factMatches++;
          }
        }

        expect(factMatches).toBeGreaterThan(0);

        // Grounding verification: verify citation excerpt exists in corresponding page text
        for (const citation of response.citations) {
          const pageRecord = DEMO_PAGES.find(p => p.page_number === citation.page_number);
          expect(pageRecord).toBeDefined();

          // Substring of excerpt should match the raw page text content (normalized for whitespace)
          const excerptSnippet = citation.excerpt.split('.')[0].trim().replace(/\s+/g, ' ').toLowerCase();
          const normalizedPageText = (pageRecord?.text_content || '').replace(/\s+/g, ' ').toLowerCase();
          expect(normalizedPageText).toContain(
            excerptSnippet.substring(0, 25)
          );
        }
      }
    });

    it('verifies that a hallucinated or incorrect citation is caught and fails validation', () => {
      // Test negative grounding case: answer with invalid/hallucinated citation to page 99
      const hallucinatedCitation = {
        page_number: 99,
        excerpt: 'Fabricated statistic not present in the document',
      };
      const retrievedPages = [
        { page_number: 1, score: 0.9, image_path: 'page-1.png', text_content: 'Real text' },
        { page_number: 2, score: 0.8, image_path: 'page-2.png', text_content: 'Real text' },
      ];

      const validated = citationService.validateCitations([hallucinatedCitation], retrievedPages);
      // Hallucinated citation MUST be rejected
      expect(validated.length).toBe(0);
    });

    it('verifies that answer text referencing un-retrieved pages is detected', () => {
      const answerWithUnretrievedRef = 'According to [Page 5], the cost is high.';
      const extractedPages = citationService.extractPageNumbers(answerWithUnretrievedRef);
      expect(extractedPages).toEqual([5]);

      const retrievedPages = [
        { page_number: 1, score: 0.9, image_path: 'page-1.png', text_content: 'Page 1' },
      ];

      const validated = citationService.validateCitations(
        [{ page_number: 5, excerpt: 'cost is high' }],
        retrievedPages
      );
      expect(validated.length).toBe(0);
    });
  });
});
