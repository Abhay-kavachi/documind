import type { ConversationRecord } from '@/lib/types';

interface AnswerDisplayProps {
  conversation: ConversationRecord;
  onCitationClick: (_pageNumber: number) => void;
}

export function AnswerDisplay({ conversation, onCitationClick }: AnswerDisplayProps) {
  // Regex to find citation markers like [Page X] and replace with clickable spans
  const parts = conversation.answer.split(/(\[Page \d+\])/g);

  return (
    <div style={{ backgroundColor: 'var(--surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)', fontSize: '0.875rem' }}>
        <span className="badge badge-neutral">{conversation.retrieval_mode === 'colpali' ? 'ColPali Retrieval' : 'Fallback Mode'}</span>
        <span style={{ color: 'var(--text-secondary)' }}>Confidence: {(conversation.confidence * 100).toFixed(0)}%</span>
      </div>
      
      <div style={{ lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
        {parts.map((part, i) => {
          const match = part.match(/\[Page (\d+)\]/);
          if (match) {
            const pageNum = parseInt(match[1]);
            return (
              <button 
                key={i} 
                onClick={() => onCitationClick(pageNum)}
                style={{ 
                  color: 'var(--accent-color)', 
                  fontWeight: 600, 
                  fontSize: '0.875rem',
                  padding: '0 4px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  margin: '0 2px'
                }}
              >
                {part}
              </button>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>

      {conversation.provenance && (
        <details style={{ marginTop: 'var(--spacing-4)', fontSize: '0.875rem' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 500 }}>View Provenance</summary>
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
            {conversation.provenance}
          </div>
        </details>
      )}
    </div>
  );
}
