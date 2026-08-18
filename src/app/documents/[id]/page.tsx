'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { DocumentRecord, PageRecord, ConversationRecord } from '@/lib/types';
import { EvidenceViewer } from '@/components/evidence-viewer';
import { ConversationHistory } from '@/components/conversation-history';
import { QuestionInput } from '@/components/question-input';
import { ProcessingStatus } from '@/components/processing-status';

export default function DocumentWorkspace({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  const [activePage, setActivePage] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [docRes, pagesRes, convRes] = await Promise.all([
        fetch(`/api/documents/${params.id}`),
        fetch(`/api/documents/${params.id}/pages`),
        fetch(`/api/documents/${params.id}/conversations`)
      ]);
      const docData = await docRes.json();
      const pagesData = await pagesRes.json();
      const convData = await convRes.json();
      
      setDocument(docData.data);
      if (pagesData.data) setPages(pagesData.data);
      if (convData.data) setConversations(convData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleAsk = async (question: string) => {
    setAsking(true);
    try {
      const res = await fetch(`/api/documents/${params.id}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const json = await res.json();
      if (json.data) {
        // Re-fetch conversations to get the full persisted record
        const convRes = await fetch(`/api/documents/${params.id}/conversations`);
        const convData = await convRes.json();
        if (convData.data) setConversations(convData.data);
      } else if (json.error) {
        console.error('Ask failed:', json.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return <div className="page-container"><div className="skeleton" style={{ height: '100%', minHeight: '600px' }}></div></div>;
  }

  if (!document) {
    return (
      <div className="page-container">
        <h2>Document not found</h2>
        <Link href="/" className="btn btn-secondary" style={{ marginTop: 'var(--spacing-4)' }}>Back to Library</Link>
      </div>
    );
  }

  const isReady = document.status === 'ready';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', backgroundColor: 'var(--surface-color)' }}>
        <button onClick={() => router.push('/')} className="btn btn-secondary" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            {document.title}
            {document.source === 'demo' && <span className="badge badge-demo">DEMO</span>}
          </h1>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{document.file_name} &bull; {document.num_pages} pages</div>
        </div>
      </header>

      {!isReady ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProcessingStatus status={document.status} errorMessage={document.error_message} />
        </div>
      ) : (
        <div className="split-view animate-fade-in">
          <div className="split-panel" style={{ flex: '1.2' }}>
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>Evidence Viewer</div>
            <EvidenceViewer 
              pages={pages} 
              activePage={activePage} 
              onPageSelect={setActivePage} 
              documentId={document.id} 
            />
          </div>
          <div className="split-panel">
            <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>Conversation</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-4)' }}>
              <ConversationHistory conversations={conversations} onCitationClick={setActivePage} />
              {asking && <div className="animate-pulse" style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)' }}>Analyzing document...</div>}
            </div>
            <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
              <QuestionInput onAsk={handleAsk} disabled={asking} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
