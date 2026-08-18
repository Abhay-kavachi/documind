'use client';

import { useState, useRef } from 'react';

interface UploadDialogProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export function UploadDialog({ onClose, onUploadComplete }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected: File) => {
    setError(null);
    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB.');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      onUploadComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--surface-color)', padding: 'var(--spacing-6)',
        borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px',
        border: '1px solid var(--border-color)'
      }} className="animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Upload Document</h2>
          <button onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div 
          style={{
            border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-8)', textAlign: 'center', cursor: 'pointer',
            backgroundColor: file ? 'var(--surface-elevated)' : 'transparent',
            marginBottom: 'var(--spacing-4)'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" style={{ display: 'none' }} />
          <svg style={{ margin: '0 auto var(--spacing-2)' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          {file ? (
            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
          ) : (
            <>
              <div style={{ fontWeight: 500 }}>Click or drag PDF to upload</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Max 50MB</div>
            </>
          )}
        </div>

        {error && <div style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginBottom: 'var(--spacing-4)' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
