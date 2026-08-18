/**
 * Demo document seed script.
 *
 * Generates the 8-page demo PDF and seeds it into the database.
 * Run with: npm run seed
 *
 * This creates:
 * 1. A demo PDF file using pdf-lib
 * 2. Page images using sharp
 * 3. Database records for the document and pages
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// We need to set up the path aliases manually for tsx
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

// Direct imports won't work with tsx and path aliases, so we use relative paths
// This script is meant to be run standalone

const DEMO_DOCUMENT_ID = 'demo-doc-2026-ai-report';
const DEMO_USER_ID = 'demo-user-001';
const STORAGE_DIR = path.join(PROJECT_ROOT, 'storage');

interface DemoPage {
  page_number: number;
  section_title: string;
  text_content: string;
}

const DEMO_PAGES: DemoPage[] = [
  {
    page_number: 1,
    section_title: 'Executive Summary',
    text_content: `EXECUTIVE SUMMARY

The enterprise AI landscape in 2026 has reached a critical inflection point. Our analysis of 500+ enterprise deployments reveals that 73% of organizations have moved beyond pilot programs into production AI systems.

Key Findings:
• 73% of enterprises now run production AI systems
• Average ROI reaches 3.2x within 18 months
• 67% cite data quality as primary challenge
• Multimodal AI adoption grew 156% YoY
• Average enterprise AI budget: $12.4M annually

The transition from experimental to operational AI demands new governance frameworks, infrastructure investments, and organizational models.`,
  },
  {
    page_number: 2,
    section_title: 'Market Overview',
    text_content: `MARKET OVERVIEW

Global Enterprise AI Market: $247 Billion

Segment Breakdown:
Natural Language      $68.2B   27.6%
Computer Vision       $51.8B   21.0%
Multimodal AI         $44.3B   17.9%
Predictive Analytics  $38.7B   15.7%
Process Automation    $28.4B   11.5%
Other                 $15.6B    6.3%

Regional Distribution:
North America  42%  ($103.7B)
Asia Pacific   31%  ($76.6B)
Europe         21%  ($51.9B)
Rest of World   6%  ($14.8B)

Multimodal AI is the fastest-growing segment at 67% growth.`,
  },
  {
    page_number: 3,
    section_title: 'Adoption Trends',
    text_content: `ADOPTION TRENDS

Enterprise AI Maturity Model:

Stage 1 — Experimental    12%
Stage 2 — Departmental    23%
Stage 3 — Operational     38%
Stage 4 — Strategic       19%
Stage 5 — Transformative   8%

Top Adoption Barriers:
1. Data quality challenges       67%
2. Talent shortage               54%
3. Security/privacy compliance   48%
4. Legacy system integration     41%
5. Budget constraints            37%

Key Accelerators:
Pre-trained models reduce deployment time by 60%.`,
  },
  {
    page_number: 4,
    section_title: 'Cost Analysis',
    text_content: `COST ANALYSIS

Enterprise AI TCO Breakdown:

Infrastructure (35%):    $4.1M/year
  Cloud Compute          $2.8M
  Storage & Pipelines    $890K
  Networking & Security  $420K

Personnel (40%):         $4.1M/year
  ML Engineers (6.2 FTE) $1.9M
  Data Engineers (4.8)   $1.2M
  MLOps (3.1 FTE)        $680K
  Project Mgmt (1.5)     $310K

Software (15%):          $1.5M/year
Training (10%):          $1.2M/year

Average Annual TCO: $12.4M
Time to Positive ROI: 14.2 months
ROI at 18 months: 3.2x
ROI at 36 months: 5.7x`,
  },
  {
    page_number: 5,
    section_title: 'Risk Matrix',
    text_content: `RISK MATRIX

Risk Assessment:

CRITICAL RISKS:
Data Privacy    High/Critical    Immediate
Model Bias      High/High        Immediate
Security Breach Medium/Critical  Immediate

HIGH RISKS:
Regulatory      Medium/High      Short-term
Model Drift     High/Medium      Short-term

MEDIUM RISKS:
Vendor Lock-in  Medium/Medium    Medium-term
Talent Loss     High/Medium      Medium-term
IP Leakage      Low/Critical     Medium-term

78% of enterprises process PII through AI.
Bias incidents increased 45% in 2025.
AI-specific attacks: prompt injection, model extraction, adversarial inputs.`,
  },
  {
    page_number: 6,
    section_title: 'Architecture & Operating Model',
    text_content: `ARCHITECTURE & OPERATING MODEL

Recommended AI Architecture Stack:

APPLICATION LAYER
  Business Apps | APIs | Auth

ORCHESTRATION LAYER
  Model Serving | A/B Testing | Routing

MODEL LAYER
  Foundation | Fine-tuned | Multimodal

MLOps LAYER
  Training Pipelines | Model Registry

DATA LAYER
  Data Lake | Feature Store | Vector DB

INFRASTRUCTURE LAYER
  GPU Clusters | Cloud | Monitoring

Operating Model: Hub-and-Spoke
65% of successful enterprises use this model.
Central team + Business unit teams + Ethics board.`,
  },
  {
    page_number: 7,
    section_title: 'Recommendations',
    text_content: `RECOMMENDATIONS

IMMEDIATE (0-6 months):
1. Establish AI Governance Framework
2. Invest in Data Infrastructure
3. Adopt Multimodal AI Capabilities
   - Pilot ColPali for document processing
   - Benchmark multimodal vs text-only

MEDIUM-TERM (6-18 months):
4. Build MLOps Maturity
   - Automated monitoring & drift detection
   - A/B testing infrastructure
5. Develop AI-Native Security
   - Prompt injection prevention
   - Adversarial testing in CI/CD

LONG-TERM (18-36 months):
6. Scale AI-First Operations
   - Product-based AI development
   - Internal model distillation`,
  },
  {
    page_number: 8,
    section_title: 'Conclusion',
    text_content: `CONCLUSION

Key Takeaways:

1. Production AI is mainstream — 73% operational
2. Multimodal AI: fastest-growing at 67%
3. Average ROI: 3.2x at 18 months
4. Data quality: #1 challenge
5. AI security: emerging critical concern
6. Hub-and-spoke: most effective model
7. MLOps investment: 2.8x higher success

Enterprises that thrive will treat AI as a core
operational capability, not isolated projects.

Report: DocuMind Research Division
Published: January 2026`,
  },
];

async function generateDemoPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 612; // Letter size
  const PAGE_HEIGHT = 792;
  const MARGIN = 50;
  const LINE_HEIGHT = 14;

  for (const pageData of DEMO_PAGES) {
    const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Header bar
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 40,
      width: PAGE_WIDTH,
      height: 40,
      color: rgb(0.102, 0.094, 0.141), // Dark navy
    });

    // Header text
    page.drawText('DocuMind Research', {
      x: MARGIN,
      y: PAGE_HEIGHT - 28,
      size: 12,
      font: fontBold,
      color: rgb(0.945, 0.961, 0.976),
    });

    page.drawText(`Page ${pageData.page_number} of 8`, {
      x: PAGE_WIDTH - MARGIN - 60,
      y: PAGE_HEIGHT - 28,
      size: 10,
      font,
      color: rgb(0.58, 0.639, 0.722),
    });

    // Section title
    page.drawText(pageData.section_title.toUpperCase(), {
      x: MARGIN,
      y: PAGE_HEIGHT - 80,
      size: 18,
      font: fontBold,
      color: rgb(0.102, 0.094, 0.141),
    });

    // Divider line
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 90,
      width: PAGE_WIDTH - 2 * MARGIN,
      height: 2,
      color: rgb(0.231, 0.510, 0.965),
    });

    // Body text
    const lines = pageData.text_content.split('\n');
    let y = PAGE_HEIGHT - 115;

    for (const line of lines) {
      if (y < MARGIN + 30) break;

      const trimmedLine = line.trimEnd();
      if (trimmedLine === '') {
        y -= LINE_HEIGHT * 0.6;
        continue;
      }

      // Check if it's a heading-like line (all caps, short)
      const isHeading = trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length < 40 && trimmedLine.length > 3;

      const currentFont = isHeading ? fontBold : font;
      const fontSize = isHeading ? 11 : 9.5;

      // Simple word wrap
      const maxWidth = PAGE_WIDTH - 2 * MARGIN;
      const words = trimmedLine.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = currentFont.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth && currentLine) {
          page.drawText(currentLine, {
            x: MARGIN,
            y,
            size: fontSize,
            font: currentFont,
            color: rgb(0.15, 0.15, 0.15),
          });
          y -= LINE_HEIGHT;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        page.drawText(currentLine, {
          x: MARGIN,
          y,
          size: fontSize,
          font: currentFont,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= LINE_HEIGHT;
      }
    }

    // Footer
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: 30,
      color: rgb(0.95, 0.95, 0.96),
    });
    page.drawText('2026 Enterprise AI Adoption & Operations Report — Confidential', {
      x: MARGIN,
      y: 10,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

async function generatePageImage(pageData: DemoPage): Promise<Buffer> {
  const width = 816;
  const height = 1056;

  // Create SVG with page content for sharp to render
  const escapedTitle = escapeXml(pageData.section_title);
  const contentLines = pageData.text_content
    .split('\n')
    .filter(l => l.trim())
    .slice(0, 30);

  let textElements = '';
  let y = 130;
  for (const line of contentLines) {
    const escapedLine = escapeXml(line.substring(0, 80));
    const isHeading = line === line.toUpperCase() && line.trim().length > 3 && line.trim().length < 40;
    const fontSize = isHeading ? 16 : 13;
    const fontWeight = isHeading ? 'bold' : 'normal';
    const fill = isHeading ? '#1a1824' : '#333333';

    textElements += `<text x="50" y="${y}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" font-family="Arial, Helvetica, sans-serif">${escapedLine}</text>\n`;
    y += isHeading ? 28 : 20;
    if (y > height - 60) break;
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="white"/>
    <rect width="${width}" height="50" fill="#1a1824"/>
    <text x="50" y="32" font-size="14" font-weight="bold" fill="#f1f5f9" font-family="Arial, Helvetica, sans-serif">DocuMind Research</text>
    <text x="${width - 100}" y="32" font-size="12" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif">Page ${pageData.page_number} of 8</text>
    <text x="50" y="90" font-size="22" font-weight="bold" fill="#1a1824" font-family="Arial, Helvetica, sans-serif">${escapedTitle}</text>
    <rect x="50" y="100" width="${width - 100}" height="3" fill="#3b82f6"/>
    ${textElements}
    <rect y="${height - 35}" width="${width}" height="35" fill="#f2f2f4"/>
    <text x="50" y="${height - 12}" font-size="10" fill="#888" font-family="Arial, Helvetica, sans-serif">2026 Enterprise AI Adoption &amp; Operations Report</text>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function seed() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding DocuMind demo data...\n');

  // Ensure storage directories exist
  const uploadsDir = path.join(STORAGE_DIR, 'uploads');
  const demoDir = path.join(STORAGE_DIR, 'demo');
  const pagesDir = path.join(STORAGE_DIR, 'pages', DEMO_DOCUMENT_ID);

  for (const dir of [uploadsDir, demoDir, pagesDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Generate demo PDF
  // eslint-disable-next-line no-console
  console.log('📄 Generating demo PDF...');
  const pdfBuffer = await generateDemoPdf();
  const pdfPath = path.join(demoDir, 'enterprise-ai-report-2026.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  // eslint-disable-next-line no-console
  console.log(`   Saved: ${pdfPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

  // Generate page images
  // eslint-disable-next-line no-console
  console.log('🖼️  Generating page images...');
  for (const pageData of DEMO_PAGES) {
    const imageBuffer = await generatePageImage(pageData);
    const imagePath = path.join(pagesDir, `page-${pageData.page_number}.png`);
    fs.writeFileSync(imagePath, imageBuffer);
    // eslint-disable-next-line no-console
    console.log(`   Page ${pageData.page_number}: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
  }

  // Initialize database
  // eslint-disable-next-line no-console
  console.log('\n💾 Seeding database...');

  // Use better-sqlite3 directly since we can't use path aliases in tsx
  const Database = (await import('better-sqlite3')).default;
  const dbPath = path.join(PROJECT_ROOT, 'documind.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      storage_key TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'upload',
      status TEXT NOT NULL DEFAULT 'uploading',
      num_pages INTEGER NOT NULL DEFAULT 0,
      doc_type TEXT NOT NULL DEFAULT 'pdf',
      summary TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      section_title TEXT,
      text_content TEXT,
      image_path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      UNIQUE(document_id, page_number)
    );
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      citations TEXT NOT NULL DEFAULT '[]',
      retrieved_pages TEXT NOT NULL DEFAULT '[]',
      confidence REAL NOT NULL DEFAULT 0,
      provenance TEXT NOT NULL DEFAULT '',
      retrieval_mode TEXT NOT NULL DEFAULT 'demo_fallback',
      status TEXT NOT NULL DEFAULT 'completed',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);

  // Ensure demo user exists
  const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(DEMO_USER_ID);
  if (!existingUser) {
    db.prepare('INSERT INTO users (id, role) VALUES (?, ?)').run(DEMO_USER_ID, 'user');
    // eslint-disable-next-line no-console
    console.log('   Created demo user');
  }

  // Delete existing demo document if present (for re-seeding)
  db.prepare('DELETE FROM pages WHERE document_id = ?').run(DEMO_DOCUMENT_ID);
  db.prepare('DELETE FROM conversations WHERE document_id = ?').run(DEMO_DOCUMENT_ID);
  db.prepare('DELETE FROM documents WHERE id = ?').run(DEMO_DOCUMENT_ID);

  // Insert demo document
  db.prepare(`
    INSERT INTO documents (id, owner_id, title, file_name, storage_key, source, status, num_pages, doc_type, summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    DEMO_DOCUMENT_ID,
    DEMO_USER_ID,
    '2026 Enterprise AI Adoption & Operations Report',
    'enterprise-ai-report-2026.pdf',
    'demo/enterprise-ai-report-2026.pdf',
    'demo',
    'ready',
    8,
    'pdf',
    'Comprehensive analysis of enterprise AI adoption trends, costs, risks, and operational models for 2026.'
  );
  // eslint-disable-next-line no-console
  console.log('   Inserted demo document');

  // Insert pages
  const { v4: uuidv4 } = await import('uuid');
  for (const pageData of DEMO_PAGES) {
    const pageId = uuidv4();
    const imagePath = `pages/${DEMO_DOCUMENT_ID}/page-${pageData.page_number}.png`;
    db.prepare(`
      INSERT INTO pages (id, document_id, page_number, section_title, text_content, image_path)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(pageId, DEMO_DOCUMENT_ID, pageData.page_number, pageData.section_title, pageData.text_content, imagePath);
  }
  // eslint-disable-next-line no-console
  console.log(`   Inserted ${DEMO_PAGES.length} pages`);

  db.close();

  // eslint-disable-next-line no-console
  console.log('\n✅ Demo seed complete!');
  // eslint-disable-next-line no-console
  console.log(`   PDF: ${pdfPath}`);
  // eslint-disable-next-line no-console
  console.log(`   Pages: ${pagesDir}`);
  // eslint-disable-next-line no-console
  console.log(`   Database: ${dbPath}`);
  // eslint-disable-next-line no-console
  console.log('\n🚀 Start the app with: npm run dev');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
