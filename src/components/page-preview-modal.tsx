'use client';

import { useEffect } from 'react';

interface PagePreviewModalProps {
  documentId: string;
  pageNumber: number;
  totalPages: number;
  onClose: () => void;
  onNavigate: (_n: number) => void;
}

export function PagePreviewModal({ documentId, pageNumber, totalPages, onClose, onNavigate }: PagePreviewModalProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && pageNumber < totalPages) onNavigate(pageNumber + 1);
      if (e.key === 'ArrowLeft' && pageNumber > 1) onNavigate(pageNumber - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, totalPages, onClose, onNavigate]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column',
      zIndex: 2000,
      padding: 'var(--spacing-4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>Page {pageNumber}</div>
        <button onClick={onClose} style={{ padding: 'var(--spacing-2)', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button 
          onClick={() => onNavigate(pageNumber - 1)} 
          disabled={pageNumber <= 1}
          style={{ position: 'absolute', left: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: '#fff', opacity: pageNumber <= 1 ? 0.3 : 1 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={`/api/documents/${documentId}/pages/${pageNumber}/image`} 
          alt={`Page ${pageNumber} Preview`} 
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', border: '1px solid var(--border-color)', backgroundColor: '#fff' }}
        />

        <button 
          onClick={() => onNavigate(pageNumber + 1)} 
          disabled={pageNumber >= totalPages}
          style={{ position: 'absolute', right: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: '#fff', opacity: pageNumber >= totalPages ? 0.3 : 1 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
