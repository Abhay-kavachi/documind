'use client';

import { useEffect, useState } from 'react';
import type { DocumentRecord } from '@/lib/types';
import { DocumentCard } from '@/components/document-card';
import { UploadDialog } from '@/components/upload-dialog';

export default function HomePage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const json = await res.json();
      if (json.data) {
        setDocuments(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      setDocuments(docs => docs.filter(d => d.id !== id));
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Document Library</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>Manage and analyze your knowledge base.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          Upload Document
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '160px' }}></div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>No documents found.</p>
          <button className="btn btn-secondary" onClick={() => setIsUploadOpen(true)}>Upload your first document</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
          {documents.map(doc => (
            <DocumentCard key={doc.id} document={doc} onDelete={() => handleDelete(doc.id)} />
          ))}
        </div>
      )}

      {isUploadOpen && (
        <UploadDialog onClose={() => setIsUploadOpen(false)} onUploadComplete={fetchDocuments} />
      )}
    </div>
  );
}
