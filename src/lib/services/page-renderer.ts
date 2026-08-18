import sharp from 'sharp';
import { DEMO_DOCUMENT_ID, DEMO_PAGES } from '@/lib/demo';

/**
 * PageRenderer — creates page images from PDFs.
 *
 * Uses sharp with SVG generation (pure JS, no ImageMagick/GraphicsMagick needed).
 * For demo documents, includes real page content.
 * For uploaded documents, creates representative page images.
 */
export const pageRenderer = {
  async renderPage(
    _pdfBuffer: Buffer,
    pageNumber: number,
    documentId: string
  ): Promise<Buffer> {
    const width = 816;
    const height = 1056;

    // For demo documents, render with actual content
    if (documentId === DEMO_DOCUMENT_ID) {
      const demoPage = DEMO_PAGES.find(p => p.page_number === pageNumber);
      if (demoPage) {
        return this.renderDemoPage(demoPage, width, height);
      }
    }

    // For uploaded documents, create a representative page image
    return this.renderPlaceholderPage(pageNumber, width, height);
  },

  async renderDemoPage(
    page: { page_number: number; section_title: string; text_content: string },
    width: number,
    height: number
  ): Promise<Buffer> {
    const escapedTitle = escapeXml(page.section_title);
    const contentLines = page.text_content
      .split('\n')
      .filter(l => l.trim())
      .slice(0, 30);

    let textElements = '';
    let y = 130;
    for (const line of contentLines) {
      const escapedLine = escapeXml(line.substring(0, 80));
      const isHeading =
        line === line.toUpperCase() && line.trim().length > 3 && line.trim().length < 40;
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
      <text x="${width - 100}" y="32" font-size="12" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif">Page ${page.page_number} of 8</text>
      <text x="50" y="90" font-size="22" font-weight="bold" fill="#1a1824" font-family="Arial, Helvetica, sans-serif">${escapedTitle}</text>
      <rect x="50" y="100" width="${width - 100}" height="3" fill="#3b82f6"/>
      ${textElements}
      <rect y="${height - 35}" width="${width}" height="35" fill="#f2f2f4"/>
      <text x="50" y="${height - 12}" font-size="10" fill="#888" font-family="Arial, Helvetica, sans-serif">2026 Enterprise AI Adoption &amp; Operations Report</text>
    </svg>`;

    return sharp(Buffer.from(svg)).png().toBuffer();
  },

  async renderPlaceholderPage(
    pageNumber: number,
    width: number,
    height: number
  ): Promise<Buffer> {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="white"/>
      <rect width="${width}" height="50" fill="#1a1824"/>
      <text x="50" y="32" font-size="14" font-weight="bold" fill="#f1f5f9" font-family="Arial, Helvetica, sans-serif">Document Viewer</text>
      <text x="${width - 100}" y="32" font-size="12" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif">Page ${pageNumber}</text>
      <text x="${width / 2}" y="${height / 2}" font-size="28" fill="#94a3b8" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">Page ${pageNumber}</text>
      <text x="${width / 2}" y="${height / 2 + 40}" font-size="14" fill="#cbd5e1" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">Document page preview</text>
    </svg>`;

    return sharp(Buffer.from(svg)).png().toBuffer();
  },
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
