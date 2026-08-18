import type { LLMResponse } from '@/lib/types';

/**
 * Demo document configuration for DocuMind.
 *
 * The demo document is an 8-page synthetic business research report:
 * "2026 Enterprise AI Adoption & Operations Report"
 *
 * This module provides:
 * - Demo document metadata
 * - Deterministic question → page retrieval mappings
 * - Pre-computed answers for demo questions
 */

export const DEMO_DOCUMENT_ID = 'demo-doc-2026-ai-report';

export const DEMO_DOCUMENT = {
  id: DEMO_DOCUMENT_ID,
  title: '2026 Enterprise AI Adoption & Operations Report',
  file_name: 'enterprise-ai-report-2026.pdf',
  storage_key: 'demo/enterprise-ai-report-2026.pdf',
  source: 'demo' as const,
  num_pages: 8,
  doc_type: 'pdf',
  summary:
    'Comprehensive analysis of enterprise AI adoption trends, costs, risks, and operational models for 2026, covering market dynamics, architecture patterns, and strategic recommendations.',
};

/**
 * Page content for the demo document.
 * Used for both PDF generation and text-based retrieval in demo mode.
 */
export const DEMO_PAGES = [
  {
    page_number: 1,
    section_title: 'Executive Summary',
    text_content: `EXECUTIVE SUMMARY

The enterprise AI landscape in 2026 has reached a critical inflection point. Our analysis of 500+ enterprise deployments reveals that 73% of organizations have moved beyond pilot programs into production AI systems. The total addressable market for enterprise AI solutions has grown to $247 billion, representing a 34% year-over-year increase.

Key findings:
• 73% of enterprises now run production AI systems (up from 41% in 2024)
• Average ROI on AI investments reaches 3.2x within 18 months of deployment
• 67% of organizations cite "data quality" as their primary operational challenge
• Multimodal AI adoption grew 156% year-over-year, driven by document processing
• The average enterprise AI budget increased to $12.4M annually

The transition from experimental to operational AI demands new governance frameworks, infrastructure investments, and organizational models. Organizations that established robust MLOps practices early are seeing 2.8x higher success rates in production deployments compared to those without structured operational frameworks.`,
  },
  {
    page_number: 2,
    section_title: 'Market Overview',
    text_content: `MARKET OVERVIEW

Global Enterprise AI Market Segmentation (2026)

| Segment              | Market Size | Growth Rate | Market Share |
|----------------------|-------------|-------------|--------------|
| Natural Language     | $68.2B      | 42%         | 27.6%        |
| Computer Vision      | $51.8B      | 28%         | 21.0%        |
| Multimodal AI        | $44.3B      | 67%         | 17.9%        |
| Predictive Analytics | $38.7B      | 19%         | 15.7%        |
| Process Automation   | $28.4B      | 23%         | 11.5%        |
| Other                | $15.6B      | 15%         | 6.3%         |

Total Market: $247.0B (34% YoY growth)

Regional Distribution:
North America leads with 42% market share ($103.7B), followed by Asia Pacific at 31% ($76.6B), Europe at 21% ($51.9B), and Rest of World at 6% ($14.8B).

The fastest-growing segment is Multimodal AI at 67% growth, driven by enterprises needing to process documents containing both text and visual elements (charts, diagrams, tables, photographs) that traditional text-only approaches cannot effectively handle.`,
  },
  {
    page_number: 3,
    section_title: 'Adoption Trends',
    text_content: `ADOPTION TRENDS

Enterprise AI Maturity Model Distribution (2026)

Stage 1 — Experimental (12%): Running isolated proofs-of-concept with limited organizational buy-in. Average team size: 3-5 data scientists.

Stage 2 — Departmental (23%): AI deployed within specific business units (typically customer service, marketing, or finance). Basic monitoring in place.

Stage 3 — Operational (38%): Multiple production AI systems with cross-departmental integration. Dedicated MLOps teams established. Formal governance policies active.

Stage 4 — Strategic (19%): AI embedded in core business strategy. Automated model lifecycle management. Board-level AI oversight committees. Real-time performance dashboards.

Stage 5 — Transformative (8%): AI-native business models. Continuous learning systems. Industry-leading innovation with proprietary data advantages.

Key Adoption Accelerators:
1. Pre-trained foundation models reducing time-to-deployment by 60%
2. Cloud-native AI platforms lowering infrastructure barriers
3. Regulatory clarity in key markets (EU AI Act implementation)
4. Demonstrated ROI from early adopters creating competitive pressure
5. Talent pool expansion through upskilling programs

Top Barriers to Adoption:
1. Data quality and integration challenges (67%)
2. Talent shortage for specialized AI roles (54%)
3. Security and privacy compliance (48%)
4. Legacy system integration (41%)
5. Budget constraints and unclear ROI metrics (37%)`,
  },
  {
    page_number: 4,
    section_title: 'Cost Analysis',
    text_content: `COST ANALYSIS

Enterprise AI Total Cost of Ownership (TCO) Breakdown

Infrastructure Costs (35% of total):
• Cloud compute (GPU/TPU): $2.8M average annually
• Storage and data pipelines: $890K average annually
• Networking and security: $420K average annually

Personnel Costs (40% of total):
• ML Engineers (avg 6.2 FTE): $1.9M average annually
• Data Engineers (avg 4.8 FTE): $1.2M average annually
• AI/ML Operations (avg 3.1 FTE): $680K average annually
• Project Management (avg 1.5 FTE): $310K average annually

Software and Services (15% of total):
• AI platform licenses: $840K average annually
• Third-party model APIs: $520K average annually
• Monitoring and observability tools: $180K average annually

Training and Change Management (10% of total):
• Employee upskilling programs: $340K average annually
• External consulting: $480K average annually
• Change management initiatives: $390K average annually

Average Annual TCO: $12.4M per enterprise
Average Time to Positive ROI: 14.2 months
Average ROI at 18 months: 3.2x
Average ROI at 36 months: 5.7x

Cost Optimization Strategies:
1. Multi-cloud GPU arbitrage (potential 28% savings)
2. Model distillation and quantization (40-60% inference cost reduction)
3. Shared service models for common AI capabilities
4. Open-source foundation model fine-tuning vs. proprietary APIs`,
  },
  {
    page_number: 5,
    section_title: 'Risk Matrix',
    text_content: `RISK MATRIX

Enterprise AI Risk Assessment Framework

| Risk Category      | Likelihood | Impact  | Risk Level | Mitigation Priority |
|-------------------|------------|---------|------------|-------------------|
| Data Privacy       | High       | Critical| Critical   | Immediate          |
| Model Bias         | High       | High    | High       | Immediate          |
| Security Breach    | Medium     | Critical| High       | Immediate          |
| Regulatory Non-compliance | Medium | High | High       | Short-term         |
| Model Drift        | High       | Medium  | High       | Short-term         |
| Vendor Lock-in     | Medium     | Medium  | Medium     | Medium-term        |
| Talent Attrition   | High       | Medium  | Medium     | Medium-term        |
| IP Leakage         | Low        | Critical| Medium     | Medium-term        |
| Technical Debt     | High       | Low     | Medium     | Long-term          |
| Over-automation    | Low        | Medium  | Low        | Long-term          |

Critical Risk Details:

Data Privacy: 78% of enterprises process personally identifiable information (PII) through AI systems. GDPR, CCPA, and emerging regulations require rigorous data governance. Recommended: implement differential privacy, data minimization, and automated PII detection pipelines.

Model Bias: Documented bias incidents increased 45% in 2025. Organizations must implement bias testing frameworks, diverse training data audits, and continuous fairness monitoring across all production models.

Security: AI-specific attack vectors including prompt injection, model extraction, training data poisoning, and adversarial inputs require dedicated security measures beyond traditional application security.`,
  },
  {
    page_number: 6,
    section_title: 'Architecture & Operating Model',
    text_content: `ARCHITECTURE & OPERATING MODEL

Recommended Enterprise AI Architecture Stack

┌─────────────────────────────────────────────┐
│            APPLICATION LAYER                 │
│  Business Applications • User Interfaces    │
│  API Gateway • Authentication               │
├─────────────────────────────────────────────┤
│            ORCHESTRATION LAYER              │
│  Model Serving • A/B Testing • Routing      │
│  Load Balancing • Rate Limiting             │
├─────────────────────────────────────────────┤
│            MODEL LAYER                      │
│  Foundation Models • Fine-tuned Models      │
│  Multimodal Models • Domain-Specific Models │
├─────────────────────────────────────────────┤
│            MLOps LAYER                      │
│  Training Pipelines • Model Registry        │
│  Experiment Tracking • CI/CD for ML         │
├─────────────────────────────────────────────┤
│            DATA LAYER                       │
│  Data Lake • Feature Store • Vector DB      │
│  Data Quality • Lineage • Governance        │
├─────────────────────────────────────────────┤
│            INFRASTRUCTURE LAYER             │
│  GPU Clusters • Cloud Services • Storage    │
│  Monitoring • Logging • Security            │
└─────────────────────────────────────────────┘

Operating Model — Hub-and-Spoke:
• Central AI Platform Team: Manages shared infrastructure, model registry, governance frameworks, and security policies.
• Business Unit AI Teams: Domain-specific model development, business integration, and outcome measurement.
• AI Ethics Board: Cross-functional committee reviewing high-impact deployments, bias assessments, and compliance.

65% of successful enterprises have adopted this hub-and-spoke model, compared to only 28% using fully centralized and 7% using fully decentralized approaches.`,
  },
  {
    page_number: 7,
    section_title: 'Recommendations',
    text_content: `RECOMMENDATIONS

Strategic Recommendations for Enterprise AI Leaders (2026-2028)

IMMEDIATE ACTIONS (0-6 months):

1. Establish AI Governance Framework
   • Form cross-functional AI governance committee
   • Define model approval and review processes
   • Implement automated compliance monitoring
   • Create incident response playbooks for AI failures

2. Invest in Data Infrastructure
   • Audit data quality across all AI-consumed sources
   • Implement automated data validation pipelines
   • Deploy data lineage tracking
   • Establish feature store for reusable ML features

3. Adopt Multimodal AI Capabilities
   • Evaluate multimodal models for document-heavy workflows
   • Pilot visual retrieval systems (e.g., ColPali) for document processing
   • Build internal expertise in vision-language models
   • Benchmark multimodal vs. text-only approaches for accuracy

MEDIUM-TERM PRIORITIES (6-18 months):

4. Build MLOps Maturity
   • Deploy automated model monitoring and drift detection
   • Implement A/B testing infrastructure for model updates
   • Create model performance SLAs with business stakeholders
   • Automate model retraining triggers based on performance thresholds

5. Develop AI-Native Security Posture
   • Implement prompt injection detection and prevention
   • Deploy adversarial input testing in CI/CD pipelines
   • Establish model access controls and audit logging
   • Create AI-specific threat models and penetration testing programs

LONG-TERM VISION (18-36 months):

6. Scale AI-First Operations
   • Transition from project-based to product-based AI development
   • Build internal model distillation capabilities
   • Develop proprietary data advantages through continuous learning
   • Establish industry partnerships for responsible AI standards`,
  },
  {
    page_number: 8,
    section_title: 'Conclusion',
    text_content: `CONCLUSION

The 2026 enterprise AI landscape presents both unprecedented opportunity and significant complexity. Organizations that approach AI transformation with structured governance, robust data infrastructure, and clear operational frameworks will capture disproportionate value.

Key Takeaways:

1. Production AI is now mainstream — 73% of enterprises operate production AI systems, making operational excellence the primary differentiator.

2. Multimodal AI is the fastest-growing segment at 67% growth, fundamentally changing how enterprises process documents, images, and complex data.

3. The average 3.2x ROI at 18 months validates enterprise AI investment, but this requires disciplined execution and clear success metrics.

4. Data quality remains the #1 challenge — organizations must invest in data infrastructure before scaling AI capabilities.

5. AI security is an emerging critical concern — prompt injection, model extraction, and adversarial attacks require dedicated defense strategies.

6. The hub-and-spoke operating model has proven most effective, balancing centralized governance with business unit agility.

7. Early investment in MLOps practices yields 2.8x higher success rates — automation of the model lifecycle is essential, not optional.

The enterprises that thrive in 2026 and beyond will be those that treat AI not as a collection of isolated projects, but as a core operational capability requiring the same rigor in engineering, governance, and continuous improvement as any critical business system.

---
Report prepared by DocuMind Research Division
Published: January 2026
Classification: For demonstration purposes`,
  },
];

/**
 * Deterministic question → page retrieval mappings.
 */
interface DemoRetrievalMapping {
  keywords: string[];
  pages: number[];
}

const DEMO_RETRIEVAL_MAPPINGS: DemoRetrievalMapping[] = [
  {
    keywords: ['executive summary', 'overview', 'key findings', 'main findings', 'summary'],
    pages: [1, 2, 8],
  },
  {
    keywords: ['market', 'market size', 'segmentation', 'market share', 'growth rate'],
    pages: [2, 1, 3],
  },
  {
    keywords: ['adoption', 'maturity', 'trends', 'stages', 'barriers', 'accelerators'],
    pages: [3, 1, 2],
  },
  {
    keywords: ['cost', 'tco', 'budget', 'roi', 'investment', 'price', 'expense', 'spending'],
    pages: [4, 1, 7],
  },
  {
    keywords: ['risk', 'security', 'bias', 'privacy', 'compliance', 'threat', 'danger'],
    pages: [5, 7, 6],
  },
  {
    keywords: ['architecture', 'operating model', 'infrastructure', 'stack', 'hub', 'spoke', 'platform'],
    pages: [6, 7, 4],
  },
  {
    keywords: ['recommend', 'strategy', 'action', 'next steps', 'priorities', 'should', 'colpali'],
    pages: [7, 6, 8],
  },
  {
    keywords: ['conclusion', 'takeaway', 'future', 'outlook', 'vision'],
    pages: [8, 1, 7],
  },
  {
    keywords: ['multimodal', 'vision', 'document processing', 'visual'],
    pages: [2, 7, 1],
  },
  {
    keywords: ['data quality', 'data infrastructure', 'data governance'],
    pages: [3, 7, 4],
  },
  {
    keywords: ['mlops', 'model lifecycle', 'monitoring', 'drift'],
    pages: [7, 6, 3],
  },
  {
    keywords: ['prompt injection', 'adversarial', 'ai security'],
    pages: [5, 7, 6],
  },
];

/**
 * Find the best matching retrieval mapping for a query.
 */
export function getDemoRetrievalMapping(query: string): DemoRetrievalMapping | null {
  const normalizedQuery = query.toLowerCase();

  let bestMatch: DemoRetrievalMapping | null = null;
  let bestScore = 0;

  for (const mapping of DEMO_RETRIEVAL_MAPPINGS) {
    const score = mapping.keywords.filter(kw => normalizedQuery.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping;
    }
  }

  return bestMatch;
}

/**
 * Pre-computed demo answers keyed by question patterns.
 */
interface DemoAnswerMapping {
  keywords: string[];
  response: LLMResponse;
}

const DEMO_ANSWERS: DemoAnswerMapping[] = [
  {
    keywords: ['key findings', 'main findings', 'executive summary', 'summary', 'overview'],
    response: {
      answer:
        'The 2026 Enterprise AI report identifies five key findings: (1) 73% of enterprises now run production AI systems, up from 41% in 2024 [Page 1]. (2) The total enterprise AI market has reached $247 billion with 34% year-over-year growth [Page 2]. (3) Average ROI on AI investments reaches 3.2x within 18 months [Page 1]. (4) Multimodal AI is the fastest-growing segment at 67% growth [Page 2]. (5) 67% of organizations cite data quality as their primary operational challenge [Page 1].',
      citations: [
        { page_number: 1, excerpt: '73% of enterprises now run production AI systems (up from 41% in 2024). Average ROI on AI investments reaches 3.2x within 18 months.' },
        { page_number: 2, excerpt: 'Total Market: $247.0B (34% YoY growth). The fastest-growing segment is Multimodal AI at 67% growth.' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Executive Summary (page 1) and Market Overview (page 2).',
    },
  },
  {
    keywords: ['market size', 'how big', 'market', 'segmentation'],
    response: {
      answer:
        'The global enterprise AI market in 2026 is valued at $247 billion, with 34% year-over-year growth [Page 2]. The market is segmented into: Natural Language ($68.2B, 27.6%), Computer Vision ($51.8B, 21.0%), Multimodal AI ($44.3B, 17.9%), Predictive Analytics ($38.7B, 15.7%), Process Automation ($28.4B, 11.5%), and Other ($15.6B, 6.3%) [Page 2]. North America leads with 42% market share at $103.7B [Page 2].',
      citations: [
        { page_number: 2, excerpt: 'Total Market: $247.0B (34% YoY growth). Natural Language: $68.2B (42% growth, 27.6% share).' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Market Overview (page 2).',
    },
  },
  {
    keywords: ['cost', 'tco', 'how much', 'budget', 'roi', 'return on investment', 'expensive'],
    response: {
      answer:
        'The average enterprise AI total cost of ownership (TCO) is $12.4M annually [Page 4]. The breakdown is: Infrastructure costs at 35% ($4.1M including cloud compute, storage, networking), Personnel at 40% ($4.1M for ML engineers, data engineers, and operations staff), Software and services at 15% ($1.5M), and Training/Change Management at 10% ($1.2M) [Page 4]. The average time to positive ROI is 14.2 months, with 3.2x ROI at 18 months and 5.7x ROI at 36 months [Page 4].',
      citations: [
        { page_number: 4, excerpt: 'Average Annual TCO: $12.4M per enterprise. Average Time to Positive ROI: 14.2 months. Average ROI at 18 months: 3.2x.' },
        { page_number: 1, excerpt: 'Average ROI on AI investments reaches 3.2x within 18 months of deployment.' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Cost Analysis (page 4) with supporting data from Executive Summary (page 1).',
    },
  },
  {
    keywords: ['risk', 'threat', 'danger', 'security', 'concern'],
    response: {
      answer:
        'The report identifies three critical-level risks for enterprise AI [Page 5]: (1) Data Privacy (High likelihood, Critical impact) — 78% of enterprises process PII through AI systems; (2) Model Bias (High likelihood, High impact) — bias incidents increased 45% in 2025; (3) Security Breach (Medium likelihood, Critical impact) — AI-specific attack vectors including prompt injection, model extraction, and adversarial inputs. Additional high-level risks include regulatory non-compliance and model drift [Page 5]. The recommendations include implementing prompt injection detection, adversarial testing in CI/CD, and establishing AI-specific threat models [Page 7].',
      citations: [
        { page_number: 5, excerpt: 'Data Privacy: 78% of enterprises process PII through AI systems. Model Bias: Documented bias incidents increased 45% in 2025.' },
        { page_number: 7, excerpt: 'Develop AI-Native Security Posture: Implement prompt injection detection and prevention.' },
      ],
      confidence: 0.94,
      provenance: 'Answer sourced from Risk Matrix (page 5) and Recommendations (page 7).',
    },
  },
  {
    keywords: ['recommend', 'should', 'action', 'strategy', 'what should', 'advice', 'next'],
    response: {
      answer:
        'The report recommends a phased approach across three time horizons [Page 7]: IMMEDIATE (0-6 months): (1) Establish AI governance with cross-functional committees; (2) Invest in data infrastructure with automated quality validation; (3) Adopt multimodal AI capabilities, piloting visual retrieval systems like ColPali. MEDIUM-TERM (6-18 months): (4) Build MLOps maturity with automated monitoring and drift detection; (5) Develop AI-native security including prompt injection prevention. LONG-TERM (18-36 months): (6) Scale AI-first operations transitioning from project to product-based development [Page 7]. The recommended operating model is a hub-and-spoke structure, used by 65% of successful enterprises [Page 6].',
      citations: [
        { page_number: 7, excerpt: 'Establish AI Governance Framework. Invest in Data Infrastructure. Adopt Multimodal AI Capabilities.' },
        { page_number: 6, excerpt: '65% of successful enterprises have adopted this hub-and-spoke model.' },
      ],
      confidence: 0.93,
      provenance: 'Answer sourced from Recommendations (page 7) and Architecture & Operating Model (page 6).',
    },
  },
  {
    keywords: ['architecture', 'operating model', 'hub', 'spoke', 'infrastructure', 'stack'],
    response: {
      answer:
        'The recommended enterprise AI architecture is a six-layer stack [Page 6]: (1) Application Layer — business apps, APIs, authentication; (2) Orchestration Layer — model serving, A/B testing, routing; (3) Model Layer — foundation, fine-tuned, multimodal, and domain-specific models; (4) MLOps Layer — training pipelines, model registry, experiment tracking; (5) Data Layer — data lake, feature store, vector DB, governance; (6) Infrastructure Layer — GPU clusters, cloud services, monitoring. The recommended operating model is hub-and-spoke, where a central AI platform team manages shared infrastructure while business unit teams handle domain-specific development. This model is used by 65% of successful enterprises [Page 6].',
      citations: [
        { page_number: 6, excerpt: 'Recommended Enterprise AI Architecture Stack with six layers. Hub-and-Spoke operating model adopted by 65% of successful enterprises.' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Architecture & Operating Model (page 6).',
    },
  },
  {
    keywords: ['multimodal', 'vision', 'colpali', 'document processing', 'visual retrieval'],
    response: {
      answer:
        'Multimodal AI is the fastest-growing enterprise AI segment at 67% year-over-year growth, reaching $44.3B in market value [Page 2]. This growth is driven by enterprises needing to process documents containing both text and visual elements (charts, diagrams, tables) that traditional text-only approaches cannot effectively handle [Page 2]. The report specifically recommends piloting visual retrieval systems such as ColPali for document processing use cases [Page 7], and notes that multimodal AI adoption grew 156% year-over-year [Page 1]. The recommended immediate action is to benchmark multimodal vs. text-only approaches for accuracy [Page 7].',
      citations: [
        { page_number: 2, excerpt: 'Multimodal AI: $44.3B, 67% growth. Driven by enterprises needing to process documents containing both text and visual elements.' },
        { page_number: 7, excerpt: 'Pilot visual retrieval systems (e.g., ColPali) for document processing. Benchmark multimodal vs. text-only approaches.' },
        { page_number: 1, excerpt: 'Multimodal AI adoption grew 156% year-over-year, driven by document processing.' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Market Overview (page 2), Recommendations (page 7), and Executive Summary (page 1).',
    },
  },
  {
    keywords: ['adoption', 'maturity', 'stages', 'barriers'],
    response: {
      answer:
        'Enterprise AI adoption follows a five-stage maturity model [Page 3]: Stage 1 — Experimental (12%): isolated POCs. Stage 2 — Departmental (23%): AI in specific business units. Stage 3 — Operational (38%): multiple production systems with cross-departmental integration. Stage 4 — Strategic (19%): AI embedded in core strategy. Stage 5 — Transformative (8%): AI-native business models. The top barriers to adoption are data quality challenges (67%), talent shortage (54%), security/privacy compliance (48%), legacy system integration (41%), and budget constraints (37%) [Page 3]. Key accelerators include pre-trained models reducing deployment time by 60% and cloud-native platforms lowering infrastructure barriers [Page 3].',
      citations: [
        { page_number: 3, excerpt: 'Operational (38%): Multiple production AI systems with cross-departmental integration. Top barrier: Data quality challenges (67%).' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Adoption Trends (page 3).',
    },
  },
];

/**
 * Find the best matching demo answer for a query.
 */
export function getDemoAnswer(query: string): LLMResponse | null {
  const normalizedQuery = query.toLowerCase();

  let bestMatch: DemoAnswerMapping | null = null;
  let bestScore = 0;

  for (const mapping of DEMO_ANSWERS) {
    const score = mapping.keywords.filter(kw => normalizedQuery.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping;
    }
  }

  return bestMatch?.response || null;
}
