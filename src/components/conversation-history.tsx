import type { ConversationRecord } from '@/lib/types';
import { AnswerDisplay } from './answer-display';

interface ConversationHistoryProps {
  conversations: ConversationRecord[];
  onCitationClick: (_pageNumber: number) => void;
}

export function ConversationHistory({ conversations, onCitationClick }: ConversationHistoryProps) {
  if (conversations.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', textAlign: 'center' }}>
        <svg style={{ marginBottom: 'var(--spacing-4)', opacity: 0.5 }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <p>No questions yet.</p>
        <p style={{ fontSize: '0.875rem' }}>Ask a question below to start analyzing this document.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {conversations.map((conv) => (
        <div key={conv.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--surface-color)', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', maxWidth: '85%' }}>
            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{conv.question}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)', textAlign: 'right' }}>
              {new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div style={{ alignSelf: 'flex-start', maxWidth: '95%' }}>
            <AnswerDisplay conversation={conv} onCitationClick={onCitationClick} />
          </div>
        </div>
      ))}
    </div>
  );
}
