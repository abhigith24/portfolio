'use client';

import { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, Star, StarOff, FileText } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadFile } from '@/lib/supabase/storage';
import { serverTimestamp } from 'firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { SUPABASE_BUCKETS } from '@/lib/constants';
import type { Resume } from '@/lib/types';

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<(Resume & { id: string })[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const data = await getDocuments<Resume>('resumes');
    setResumes(data);
  };
  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name}`;
      const url = await uploadFile(SUPABASE_BUCKETS.RESUMES, path, file);
      await addDocument('resumes', {
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileUrl: url,
        fileName: file.name,
        isDefault: resumes.length === 0,
        uploadedAt: serverTimestamp(),
      });
      await fetchData();
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const setDefault = async (id: string) => {
    for (const r of resumes) {
      await updateDocument('resumes', r.id, { isDefault: r.id === id });
    }
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    await deleteDocument('resumes', id);
    await fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Resumes</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Upload and manage resume PDFs.</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} isLoading={uploading}>
          <Upload size={16} /> Upload Resume
        </Button>
        <input ref={inputRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
      </div>

      <div className="space-y-4">
        {resumes.map((r) => (
          <Card key={r.id} hover={false}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--color-text)]">{r.title}</p>
                    {r.isDefault && <Badge variant="primary" size="sm">Default</Badge>}
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{r.fileName}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                  <FileText size={14} />
                </a>
                <button onClick={() => setDefault(r.id)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-amber-500 transition-colors cursor-pointer" title="Set as default">
                  {r.isDefault ? <Star size={14} className="fill-amber-500 text-amber-500" /> : <StarOff size={14} />}
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {resumes.length === 0 && <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No resumes uploaded yet.</p></Card>}
    </div>
  );
}
