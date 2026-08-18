'use client';

import { useState } from 'react';

interface QuestionInputProps {
  onAsk: (_q: string) => void;
  disabled?: boolean;
}

export function QuestionInput({ onAsk, disabled }: QuestionInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim() && !disabled) {
      onAsk(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask a question about this document..."
        style={{
          width: '100%',
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-3) var(--spacing-12) var(--spacing-3) var(--spacing-3)',
          color: 'var(--text-primary)',
          resize: 'none',
          minHeight: '60px',
          maxHeight: '200px'
        }}
        rows={2}
      />
      <button 
        type="submit" 
        disabled={!value.trim() || disabled}
        style={{
          position: 'absolute',
          right: 'var(--spacing-2)',
          bottom: 'var(--spacing-2)',
          backgroundColor: value.trim() && !disabled ? 'var(--accent-color)' : 'var(--surface-elevated)',
          color: value.trim() && !disabled ? '#fff' : 'var(--text-secondary)',
          padding: 'var(--spacing-2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
        aria-label="Submit question"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </form>
  );
}
