'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const [config, setConfig] = useState({ retrieval_mode: '', llm_provider: '', is_demo_mode: false });

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(d => { if(d.data) setConfig(d.data); })
      .catch(console.error);
  }, []);

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--surface-color)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-4)',
      height: '100vh'
    }}>
      <div style={{ paddingBottom: 'var(--spacing-6)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--spacing-4)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          DocuMind
        </h2>
        {config.is_demo_mode && (
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            <span className="badge badge-demo">DEMO MODE</span>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)',
          padding: 'var(--spacing-2) var(--spacing-3)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: pathname === '/' ? 'var(--surface-elevated)' : 'transparent',
          color: pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: pathname === '/' ? 600 : 500,
          transition: 'all 0.2s'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Library
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ marginBottom: 'var(--spacing-1)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Retrieval:</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{config.retrieval_mode === 'colpali' ? 'ColPali' : 'Fallback'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>LLM:</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{config.llm_provider || 'Loading...'}</span>
        </div>
      </div>
    </aside>
  );
}
