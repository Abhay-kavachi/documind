'use client';

import { useState } from 'react';
import type { PageRecord } from '@/lib/types';
import { PagePreviewModal } from './page-preview-modal';

interface EvidenceViewerProps {
  pages: PageRecord[];
  activePage: number | null;
  onPageSelect: (_pageNumber: number) => void;
  documentId: string;
}

export function EvidenceViewer({ pages, activePage, onPageSelect, documentId }: EvidenceViewerProps) {
  const [previewPage, setPreviewPage] = useState<number | null>(null);

  if (!pages || pages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No pages processed yet.
      </div>
    );
  }

  // Sort pages
  const sortedPages = [...pages].sort((a, b) => a.page_number - b.page_number);

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--spacing-4)', alignContent: 'start' }}>
        {sortedPages.map((page) => (
          <div 
            key={page.id}
            onClick={() => onPageSelect(page.page_number)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              border: activePage === page.page_number ? '2px solid var(--accent-color)' : '2px solid transparent',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              transition: 'all 0.2s',
              backgroundColor: 'var(--surface-elevated)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`/api/documents/${documentId}/pages/${page.page_number}/image`} 
              alt={`Page ${page.page_number}`} 
              style={{ width: '100%', aspectRatio: '1/1.4', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'var(--spacing-1) var(--spacing-2)', background: 'linear-gradient(rgba(0,0,0,0.7), transparent)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              <span>Page {page.page_number}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setPreviewPage(page.page_number); }}
                style={{ color: '#fff' }}
                aria-label="Expand"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewPage !== null && (
        <PagePreviewModal 
          documentId={documentId} 
          pageNumber={previewPage} 
          onClose={() => setPreviewPage(null)} 
          totalPages={sortedPages.length}
          onNavigate={(n) => setPreviewPage(n)}
        />
      )}
    </>
  );
}
