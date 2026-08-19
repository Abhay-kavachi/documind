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
  // Page 1: Executive summary, high level statistics, ROI, MLOps success
  {
    keywords: ['executive summary', 'main findings', 'key findings', 'high level summary', 'production percentage', '73%', 'average budget'],
    pages: [1, 2, 8],
  },
  {
    keywords: ['roi on ai', 'investment return', 'return on investment', '18 months roi', '3.2x'],
    pages: [1, 4, 8],
  },
  {
    keywords: ['mlops success rate', 'structured operational', 'mlops practice', '2.8x higher', 'higher is the success rate', 'success rate for organizations', 'structured mlops'],
    pages: [1, 7, 8],
  },

  // Page 2: Market size, segmentation, regional distribution, multimodal growth
  {
    keywords: ['market size', 'global enterprise ai market', 'total addressable market', '247 billion', '$247', 'market valuation'],
    pages: [2, 1, 3],
  },
  {
    keywords: ['market segmentation', 'natural language market', 'computer vision market', 'predictive analytics market', 'process automation market', 'segment breakdown'],
    pages: [2, 1, 3],
  },
  {
    keywords: ['regional distribution', 'north america share', 'asia pacific market', 'europe market share', 'geographic distribution'],
    pages: [2, 1, 3],
  },
  {
    keywords: ['multimodal ai segment', 'fastest-growing segment', 'fastest growing market', '67% growth'],
    pages: [2, 1, 7],
  },

  // Page 3: Maturity stages, barriers, accelerators
  {
    keywords: ['maturity model', 'five-stage', '5 stages', 'maturity stages', 'experimental stage', 'departmental stage', 'operational stage', 'strategic stage', 'transformative stage'],
    pages: [3, 1, 6],
  },
  {
    keywords: ['top barriers', 'barriers to adoption', 'adoption challenges', 'talent shortage', 'legacy system integration'],
    pages: [3, 1, 7],
  },
  {
    keywords: ['adoption accelerators', 'faster deployment', 'time-to-deployment', '60% reduction', 'foundation model accelerator'],
    pages: [3, 7, 1],
  },

  // Page 4: Cost Analysis, TCO, Personnel, Infrastructure, Cost optimization
  {
    keywords: ['total cost of ownership', 'tco', 'annual budget', '$12.4m', '12.4 million', 'annual cost', 'how much does ai cost'],
    pages: [4, 1, 7],
  },
  {
    keywords: ['infrastructure cost', 'gpu compute cost', 'cloud compute spending', 'storage and data pipeline cost', '$2.8m', 'compute budget'],
    pages: [4, 6, 1],
  },
  {
    keywords: ['personnel cost', 'ml engineers salary', 'data engineers fte', 'headcount cost', 'staffing cost', 'fte breakdown'],
    pages: [4, 3, 1],
  },
  {
    keywords: ['time to positive roi', 'payback period', '14.2 months', '36 months roi', '5.7x'],
    pages: [4, 1, 8],
  },
  {
    keywords: ['cost optimization', 'gpu arbitrage', 'model distillation savings', 'quantization cost reduction', '28% savings', '40-60%'],
    pages: [4, 7, 6],
  },

  // Page 5: Risk Matrix, PII, Model Bias, Attack vectors
  {
    keywords: ['risk matrix', 'risk assessment', 'critical risks', 'highest risk', 'enterprise risks'],
    pages: [5, 7, 6],
  },
  {
    keywords: ['data privacy', 'personally identifiable information', 'pii', '78% of enterprises', 'gdpr compliance'],
    pages: [5, 7, 1],
  },
  {
    keywords: ['model bias', 'bias incidents', 'fairness monitoring', '45% increase in bias'],
    pages: [5, 7, 3],
  },
  {
    keywords: ['attack vectors', 'prompt injection threat', 'model extraction', 'adversarial inputs', 'training data poisoning', 'ai security threats'],
    pages: [5, 7, 6],
  },

  // Page 6: Architecture Stack & Operating Model
  {
    keywords: ['architecture stack', 'six-layer', '6-layer', 'orchestration layer', 'model layer', 'mlops layer', 'data layer', 'infrastructure layer'],
    pages: [6, 7, 4],
  },
  {
    keywords: ['operating model', 'hub-and-spoke', 'hub and spoke', 'central ai platform team', 'business unit ai teams', 'ai ethics board', '65% of successful'],
    pages: [6, 7, 3],
  },

  // Page 7: Recommendations, ColPali, MLOps priorities, AI security posture
  {
    keywords: ['immediate actions', '0-6 months', 'strategic recommendations', 'governance framework', 'what should enterprise leaders do'],
    pages: [7, 6, 8],
  },
  {
    keywords: ['colpali', 'visual retrieval systems', 'visual retrieval', 'multimodal capabilities', 'vision-language models', 'document-heavy workflows', 'benchmark multimodal', 'visual retrieval systems and colpali', 'colpali for document processing'],
    pages: [7, 2, 1],
  },
  {
    keywords: ['medium-term priorities', '6-18 months', 'drift detection', 'model performance sla', 'retraining triggers'],
    pages: [7, 6, 3],
  },
  {
    keywords: ['ai-native security posture', 'prompt injection prevention', 'adversarial testing in ci/cd', 'threat models'],
    pages: [7, 5, 6],
  },
  {
    keywords: ['long-term vision', '18-36 months', 'product-based ai development', 'continuous learning'],
    pages: [7, 6, 8],
  },

  // Page 8: Conclusion & Key takeaways
  {
    keywords: ['conclusion', 'key takeaways', 'concluding takeaways', 'takeaways', 'concluding remarks', 'final summary', 'report takeaways', 'final recommendations of the 2026 report'],
    pages: [8, 1, 7],
  },
  {
    keywords: ['data quality challenge', 'data quality is primary', 'data infrastructure investment', '#1 challenge'],
    pages: [1, 3, 7],
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
    let score = 0;
    for (const kw of mapping.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += kw.length; // Length-weighted matching for specificity
      }
    }
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
  // 1. Executive summary key findings
  {
    keywords: ['key findings', 'main findings', 'executive summary', 'high level summary', 'overview of findings'],
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

  // 2. Market size and growth
  {
    keywords: ['market size', 'global enterprise ai market', 'total addressable market', 'how big is the ai market', '247 billion', '$247', 'market valuation'],
    response: {
      answer:
        'The global enterprise AI market in 2026 is valued at $247 billion, with 34% year-over-year growth [Page 2]. The market is segmented across Natural Language ($68.2B, 27.6%), Computer Vision ($51.8B, 21.0%), Multimodal AI ($44.3B, 17.9%), Predictive Analytics ($38.7B, 15.7%), Process Automation ($28.4B, 11.5%), and Other ($15.6B, 6.3%) [Page 2]. North America leads globally with a 42% market share at $103.7B [Page 2].',
      citations: [
        { page_number: 2, excerpt: 'Total Market: $247.0B (34% YoY growth)' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Market Overview (page 2).',
    },
  },

  // 3. Market segmentation
  {
    keywords: ['market segmentation', 'market segmented', 'segment breakdown', 'segments of ai', 'breakdown of market share', 'technologies and what are their market shares'],
    response: {
      answer:
        'The enterprise AI market is segmented into six primary domains [Page 2]: Natural Language ($68.2B market size, 42% growth, 27.6% share), Computer Vision ($51.8B market size, 28% growth, 21.0% share), Multimodal AI ($44.3B market size, 67% growth, 17.9% share), Predictive Analytics ($38.7B market size, 19% growth, 15.7% share), Process Automation ($28.4B market size, 23% growth, 11.5% share), and Other ($15.6B, 15% growth, 6.3% share) [Page 2].',
      citations: [
        { page_number: 2, excerpt: 'Global Enterprise AI Market Segmentation (2026)' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Market Overview table on page 2.',
    },
  },

  // 4. Regional market share
  {
    keywords: ['regional distribution', 'north america share', 'asia pacific market', 'europe market share', 'geographic distribution', 'geographic market share'],
    response: {
      answer:
        'North America leads the global enterprise AI market with 42% market share ($103.7B), followed by Asia Pacific at 31% ($76.6B), Europe at 21% ($51.9B), and the Rest of the World at 6% ($14.8B) [Page 2].',
      citations: [
        { page_number: 2, excerpt: 'Regional Distribution: North America leads with 42% market share ($103.7B)' },
      ],
      confidence: 0.98,
      provenance: 'Answer sourced from Regional Distribution section on page 2.',
    },
  },

  // 5. Multimodal AI growth
  {
    keywords: ['multimodal ai', 'fastest-growing segment', 'fastest growing market', 'why is multimodal growing', '67% growth'],
    response: {
      answer:
        'Multimodal AI is the fastest-growing enterprise AI segment with 67% year-over-year growth, reaching $44.3 billion in market value [Page 2]. This surge is driven by organizations needing to analyze complex documents that combine text, tables, charts, diagrams, and layout features that traditional text-only systems fail to interpret [Page 2]. Multimodal AI adoption grew 156% year-over-year overall [Page 1].',
      citations: [
        { page_number: 2, excerpt: 'The fastest-growing segment is Multimodal AI at 67% growth, driven by enterprises needing to process documents containing both text and visual elements' },
        { page_number: 1, excerpt: 'Multimodal AI adoption grew 156% year-over-year, driven by document processing' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Market Overview (page 2) and Executive Summary (page 1).',
    },
  },

  // 6. Maturity model stages
  {
    keywords: ['maturity model', 'five-stage', '5 stages', 'five stages', 'maturity stages', 'stages of adoption', 'experimental stage'],
    response: {
      answer:
        'The Enterprise AI Maturity Model comprises five distinct stages [Page 3]: Stage 1 — Experimental (12% of orgs, running isolated POCs), Stage 2 — Departmental (23%, deployed in specific units like marketing/finance), Stage 3 — Operational (38%, multiple production systems with MLOps and formal governance), Stage 4 — Strategic (19%, board-level oversight and automated model lifecycle), and Stage 5 — Transformative (8%, AI-native business models and proprietary continuous learning systems) [Page 3].',
      citations: [
        { page_number: 3, excerpt: 'Enterprise AI Maturity Model Distribution (2026)' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Adoption Trends (page 3).',
    },
  },

  // 7. Barriers to adoption
  {
    keywords: ['top barriers', 'barriers to adoption', 'adoption challenges', 'biggest obstacle', 'talent shortage'],
    response: {
      answer:
        'The top five barriers to enterprise AI adoption in 2026 are [Page 3]: (1) Data quality and integration challenges (67%), (2) Talent shortage for specialized AI roles (54%), (3) Security and privacy compliance (48%), (4) Legacy system integration (41%), and (5) Budget constraints and unclear ROI metrics (37%) [Page 3].',
      citations: [
        { page_number: 3, excerpt: 'Top Barriers to Adoption: 1. Data quality and integration challenges (67%)' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Adoption Trends (page 3).',
    },
  },

  // 8. Adoption accelerators
  {
    keywords: ['adoption accelerators', 'faster deployment', 'time-to-deployment', 'what accelerates adoption', 'primary adoption accelerators', '60% reduction'],
    response: {
      answer:
        'Key adoption accelerators include pre-trained foundation models that reduce time-to-deployment by 60%, cloud-native AI platforms that lower infrastructure barriers, regulatory clarity from implementations like the EU AI Act, demonstrated ROI from early adopters, and talent pool expansion through structured upskilling [Page 3].',
      citations: [
        { page_number: 3, excerpt: 'Key Adoption Accelerators: 1. Pre-trained foundation models reducing time-to-deployment by 60%' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Adoption Trends (page 3).',
    },
  },

  // 9. Total Cost of Ownership (TCO)
  {
    keywords: ['total cost of ownership', 'tco', 'annual budget', '$12.4m', '12.4 million', 'how much does ai cost', 'average tco', 'cost of ai', 'annual total cost'],
    response: {
      answer:
        'The average annual Total Cost of Ownership (TCO) for enterprise AI is $12.4 million per organization [Page 4]. Costs are distributed across Personnel (40% / $4.1M), Infrastructure (35% / $4.1M), Software and Services (15% / $1.5M), and Training/Change Management (10% / $1.2M) [Page 4]. The average time to achieve positive ROI is 14.2 months [Page 4].',
      citations: [
        { page_number: 4, excerpt: 'Average Annual TCO: $12.4M per enterprise' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Cost Analysis (page 4).',
    },
  },

  // 10. Infrastructure costs
  {
    keywords: ['infrastructure cost', 'gpu compute cost', 'cloud compute spending', 'storage and data pipeline cost', '$2.8m', 'compute budget', 'infrastructure spending'],
    response: {
      answer:
        'Infrastructure costs represent 35% ($4.1M) of total enterprise AI spending [Page 4]. This includes an average of $2.8 million annually for cloud compute (GPU/TPU resources), $890,000 for storage and data pipelines, and $420,000 for networking and infrastructure security [Page 4].',
      citations: [
        { page_number: 4, excerpt: 'Infrastructure Costs (35% of total): Cloud compute (GPU/TPU): $2.8M average annually' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Cost Analysis (page 4).',
    },
  },

  // 11. Personnel and headcount costs
  {
    keywords: ['personnel cost', 'ml engineers salary', 'data engineers fte', 'headcount cost', 'staffing cost', 'fte headcount', 'fte breakdown'],
    response: {
      answer:
        'Personnel accounts for 40% of the enterprise AI budget ($4.1M) [Page 4]. Typical enterprise staffing includes: ML Engineers (avg 6.2 FTE, $1.9M annually), Data Engineers (avg 4.8 FTE, $1.2M annually), AI/ML Operations specialists (avg 3.1 FTE, $680K annually), and Project Managers (avg 1.5 FTE, $310K annually) [Page 4].',
      citations: [
        { page_number: 4, excerpt: 'Personnel Costs (40% of total): ML Engineers (avg 6.2 FTE): $1.9M average annually' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Cost Analysis (page 4).',
    },
  },

  // 12. Return on Investment (ROI)
  {
    keywords: ['return multiple', 'positive roi', 'time to positive roi', 'payback', '14.2 months', '36 months roi', '5.7x', '18 and 36 months'],
    response: {
      answer:
        'Enterprise AI investments reach an average positive ROI in 14.2 months [Page 4]. The average return on investment climbs to 3.2x at 18 months [Page 1, Page 4] and expands to 5.7x at 36 months of deployment [Page 4].',
      citations: [
        { page_number: 4, excerpt: 'Average Time to Positive ROI: 14.2 months. Average ROI at 18 months: 3.2x. Average ROI at 36 months: 5.7x.' },
        { page_number: 1, excerpt: 'Average ROI on AI investments reaches 3.2x within 18 months of deployment.' },
      ],
      confidence: 0.98,
      provenance: 'Answer sourced from Cost Analysis (page 4) and Executive Summary (page 1).',
    },
  },

  // 13. Cost optimization strategies
  {
    keywords: ['cost optimization', 'gpu arbitrage', 'model distillation savings', 'quantization cost reduction', '28% savings', '40-60%', 'optimization strategies'],
    response: {
      answer:
        'The report highlights four key cost optimization strategies [Page 4]: (1) Multi-cloud GPU arbitrage (generating up to 28% infrastructure savings), (2) Model distillation and quantization (reducing inference costs by 40–60%), (3) Shared service models for common organizational capabilities, and (4) Fine-tuning open-source foundation models versus relying solely on proprietary APIs [Page 4].',
      citations: [
        { page_number: 4, excerpt: 'Cost Optimization Strategies: 1. Multi-cloud GPU arbitrage (potential 28% savings)' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Cost Analysis (page 4).',
    },
  },

  // 14. Critical risks in risk matrix
  {
    keywords: ['critical risks', 'highest risk', 'risk assessment', 'security risk', 'threat matrix', 'risk matrix'],
    response: {
      answer:
        'The enterprise AI risk matrix identifies Data Privacy as Critical risk (High likelihood, Critical impact), Model Bias as High risk (High likelihood, High impact), and Security Breaches as High risk (Medium likelihood, Critical impact) [Page 5]. Regulatory non-compliance and model drift also rank as high risks requiring short-term mitigation [Page 5].',
      citations: [
        { page_number: 5, excerpt: 'Enterprise AI Risk Assessment Framework' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Risk Matrix (page 5).',
    },
  },

  // 15. PII and data privacy
  {
    keywords: ['data privacy', 'pii', 'personally identifiable information', '78% of enterprises', 'gdpr compliance', 'privacy risk', 'percentage of enterprises process pii'],
    response: {
      answer:
        '78% of enterprises process personally identifiable information (PII) through AI systems, creating significant compliance exposure under GDPR and CCPA [Page 5]. To mitigate critical privacy risks, the report recommends deploying automated PII detection pipelines, data minimization practices, and differential privacy mechanisms [Page 5].',
      citations: [
        { page_number: 5, excerpt: 'Data Privacy: 78% of enterprises process personally identifiable information (PII)' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Risk Matrix (page 5).',
    },
  },

  // 16. AI attack vectors
  {
    keywords: ['attack vectors', 'prompt injection threat', 'model extraction', 'adversarial inputs', 'training data poisoning', 'ai security threats', 'ai-specific attack vectors'],
    response: {
      answer:
        'Enterprise AI faces novel, AI-specific attack vectors including prompt injection, model extraction, training data poisoning, and adversarial inputs that bypass traditional application security controls [Page 5]. Recommended defenses include prompt injection detection and adversarial input testing embedded directly into CI/CD pipelines [Page 7].',
      citations: [
        { page_number: 5, excerpt: 'Security: AI-specific attack vectors including prompt injection, model extraction' },
        { page_number: 7, excerpt: '5. Develop AI-Native Security Posture' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Risk Matrix (page 5) and Recommendations (page 7).',
    },
  },

  // 17. Model bias trends
  {
    keywords: ['model bias', 'bias incidents', 'fairness monitoring', '45% increase in bias', 'model bias incidents increase in 2025'],
    response: {
      answer:
        'Documented model bias incidents increased by 45% during 2025 [Page 5]. Organizations are advised to establish comprehensive bias testing frameworks, conduct audits across diverse training datasets, and maintain continuous fairness monitoring across all production models [Page 5].',
      citations: [
        { page_number: 5, excerpt: 'Model Bias: Documented bias incidents increased 45% in 2025' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Risk Matrix (page 5).',
    },
  },

  // 18. Enterprise AI architecture stack
  {
    keywords: ['architecture stack', 'six-layer', '6-layer', 'orchestration layer', 'model layer', 'mlops layer', 'data layer', 'infrastructure layer', 'six-layer enterprise ai architecture'],
    response: {
      answer:
        'The recommended architecture is a six-layer stack [Page 6]: (1) Application Layer (business applications, UI, API gateway, auth), (2) Orchestration Layer (model serving, routing, A/B testing, rate limiting), (3) Model Layer (foundation, fine-tuned, multimodal, and domain models), (4) MLOps Layer (training pipelines, model registry, experiment tracking, ML CI/CD), (5) Data Layer (data lake, feature store, vector DB, lineage), and (6) Infrastructure Layer (GPU clusters, cloud services, logging, security) [Page 6].',
      citations: [
        { page_number: 6, excerpt: 'Recommended Enterprise AI Architecture Stack' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Architecture & Operating Model (page 6).',
    },
  },

  // 19. Operating model and Hub-and-Spoke
  {
    keywords: ['operating model', 'hub-and-spoke', 'hub and spoke', 'central ai platform team', 'business unit ai teams', 'ai ethics board', '65% of successful'],
    response: {
      answer:
        '65% of successful enterprises operate a Hub-and-Spoke model, compared to 28% centralized and 7% decentralized [Page 6]. In this structure, a Central AI Platform Team manages shared infrastructure and governance, Business Unit AI Teams build domain-specific applications, and an AI Ethics Board oversees high-impact deployments and fairness compliance [Page 6].',
      citations: [
        { page_number: 6, excerpt: '65% of successful enterprises have adopted this hub-and-spoke model' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Architecture & Operating Model (page 6).',
    },
  },

  // 20. Immediate recommendations
  {
    keywords: ['immediate actions', '0-6 months', 'strategic recommendations', 'governance framework', 'what should enterprise leaders do', 'immediate actions (0-6 months) are recommended'],
    response: {
      answer:
        'Immediate actions (0–6 months) for enterprise leaders include [Page 7]: (1) Establish an AI Governance Framework with a cross-functional committee, approval workflows, and incident playbooks; (2) Invest in Data Infrastructure with automated validation pipelines and lineage tracking; (3) Adopt Multimodal AI capabilities, piloting visual retrieval systems like ColPali for document processing and benchmarking multimodal versus text-only accuracy [Page 7].',
      citations: [
        { page_number: 7, excerpt: 'IMMEDIATE ACTIONS (0-6 months):' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Recommendations (page 7).',
    },
  },

  // 21. ColPali and visual retrieval recommendations
  {
    keywords: ['colpali', 'visual retrieval systems', 'multimodal capabilities', 'vision-language models', 'document-heavy workflows', 'benchmark multimodal'],
    response: {
      answer:
        'The report recommends adopting multimodal visual retrieval systems—specifically highlighting ColPali—to process document-heavy enterprise workflows [Page 7]. It urges organizations to benchmark visual multimodal retrieval against conventional text-only extraction to capture diagrams, tables, and visual context accurately [Page 7]. Multimodal AI is growing at 67% YoY [Page 2].',
      citations: [
        { page_number: 7, excerpt: 'Pilot visual retrieval systems (e.g., ColPali) for document processing' },
        { page_number: 2, excerpt: 'The fastest-growing segment is Multimodal AI at 67% growth' },
      ],
      confidence: 0.98,
      provenance: 'Answer sourced from Recommendations (page 7) and Market Overview (page 2).',
    },
  },

  // 22. Medium-term recommendations
  {
    keywords: ['medium-term priorities', '6-18 months', 'drift detection', 'model performance sla', 'retraining triggers', 'medium-term priorities (6-18 months)'],
    response: {
      answer:
        'Medium-term priorities (6–18 months) focus on: (1) Building MLOps maturity through automated monitoring, drift detection, A/B testing infrastructure, and retraining triggers; and (2) Developing an AI-native security posture with prompt injection defense, adversarial CI/CD testing, and model access controls [Page 7].',
      citations: [
        { page_number: 7, excerpt: 'MEDIUM-TERM PRIORITIES (6-18 months):' },
      ],
      confidence: 0.96,
      provenance: 'Answer sourced from Recommendations (page 7).',
    },
  },

  // 23. Long-term vision
  {
    keywords: ['long-term vision', '18-36 months', 'product-based ai development', 'continuous learning', 'scale ai-first', 'long-term vision (18-36 months)'],
    response: {
      answer:
        'The long-term vision (18–36 months) entails scaling AI-first operations by transitioning from project-based to product-based AI development, building internal model distillation capabilities, cultivating proprietary continuous-learning data advantages, and establishing industry partnerships for responsible AI [Page 7].',
      citations: [
        { page_number: 7, excerpt: 'LONG-TERM VISION (18-36 months):' },
      ],
      confidence: 0.95,
      provenance: 'Answer sourced from Recommendations (page 7).',
    },
  },

  // 24. MLOps early adoption impact
  {
    keywords: ['mlops success rate', 'structured operational', 'mlops practice', '2.8x higher', 'mlops investment', 'success rate for organizations', 'structured mlops practices'],
    response: {
      answer:
        'Organizations that established robust MLOps practices early achieve 2.8x higher success rates in production deployments compared to organizations without structured operational frameworks [Page 1, Page 8]. Automation across the model lifecycle is highlighted as essential rather than optional [Page 8].',
      citations: [
        { page_number: 1, excerpt: 'Organizations that established robust MLOps practices early are seeing 2.8x higher success rates in production deployments' },
        { page_number: 8, excerpt: 'Early investment in MLOps practices yields 2.8x higher success rates — automation of the model lifecycle is essential' },
      ],
      confidence: 0.97,
      provenance: 'Answer sourced from Executive Summary (page 1) and Conclusion (page 8).',
    },
  },

  // 25. Concluding takeaways
  {
    keywords: ['concluding takeaways', 'key takeaways', 'concluding remarks', 'final summary', 'report takeaways', 'final recommendations of the 2026 report'],
    response: {
      answer:
        'The report concludes with seven primary takeaways [Page 8]: (1) Production AI is mainstream (73% operational), (2) Multimodal AI is growing fastest (67% YoY), (3) Average ROI reaches 3.2x at 18 months, (4) Data quality is the #1 challenge, (5) AI security is an emerging critical priority, (6) Hub-and-spoke is the most effective operating model (65%), and (7) MLOps investments deliver 2.8x higher deployment success [Page 8].',
      citations: [
        { page_number: 8, excerpt: 'Key Takeaways:' },
      ],
      confidence: 0.98,
      provenance: 'Answer sourced from Conclusion (page 8).',
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
    let score = 0;
    for (const kw of mapping.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += kw.length; // Length-weighted matching for specificity
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping;
    }
  }

  return bestMatch?.response || null;
}
