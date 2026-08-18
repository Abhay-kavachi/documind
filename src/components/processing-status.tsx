interface ProcessingStatusProps {
  status: string;
  errorMessage?: string | null;
}

export function ProcessingStatus({ status, errorMessage }: ProcessingStatusProps) {
  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--error-color)' }}>
        <svg style={{ color: 'var(--error-color)', margin: '0 auto var(--spacing-4)' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3 style={{ color: 'var(--error-color)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>Processing Failed</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{errorMessage || 'An unknown error occurred during document processing.'}</p>
      </div>
    );
  }

  if (status === 'uploading' || status === 'processing') {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
        <div className="animate-spin" style={{ 
          display: 'inline-block', width: '40px', height: '40px', 
          border: '3px solid var(--surface-elevated)', borderTopColor: 'var(--accent-color)', 
          borderRadius: '50%', marginBottom: 'var(--spacing-6)' 
        }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
          {status === 'uploading' ? 'Uploading Document...' : 'Processing Document...'}
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          We are analyzing the document pages. This may take a few moments.
        </p>
      </div>
    );
  }

  return null;
}
