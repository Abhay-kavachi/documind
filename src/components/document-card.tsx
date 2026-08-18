import Link from 'next/link';
import type { DocumentRecord } from '@/lib/types';

interface DocumentCardProps {
  document: DocumentRecord;
  onDelete: () => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const isReady = document.status === 'ready';
  const isProcessing = document.status === 'processing' || document.status === 'uploading';
  const isError = document.status === 'error';

  return (
    <div style={{
      backgroundColor: 'var(--surface-color)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-3)',
      transition: 'all 0.2s',
      position: 'relative'
    }}
    className="animate-slide-up"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, paddingRight: 'var(--spacing-6)' }}>
          {isReady ? (
            <Link href={`/documents/${document.id}`} style={{ color: 'var(--text-primary)' }} className="hover:underline">
              {document.title}
            </Link>
          ) : (
            <span style={{ color: 'var(--text-primary)' }}>{document.title}</span>
          )}
        </h3>
        <button 
          onClick={(e) => { e.preventDefault(); if(confirm('Delete document?')) onDelete(); }}
          style={{ position: 'absolute', top: 'var(--spacing-4)', right: 'var(--spacing-4)', color: 'var(--text-secondary)' }}
          aria-label="Delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>

      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
        <div>{document.file_name}</div>
        <div>{document.num_pages} pages &bull; {new Date(document.created_at).toLocaleDateString()}</div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'auto', paddingTop: 'var(--spacing-2)' }}>
        {document.source === 'demo' && <span className="badge badge-demo">DEMO</span>}
        {isReady && <span className="badge badge-success">Ready</span>}
        {isProcessing && <span className="badge badge-warning animate-pulse">Processing...</span>}
        {isError && <span className="badge badge-error">Error</span>}
      </div>
      
      {isReady && (
        <Link href={`/documents/${document.id}`} className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--spacing-2)' }}>
          Open Workspace
        </Link>
      )}
    </div>
  );
}
