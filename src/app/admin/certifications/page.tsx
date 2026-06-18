'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ImageUploader from '@/components/admin/ImageUploader';
import { SUPABASE_BUCKETS } from '@/lib/constants';
import type { Certification } from '@/lib/types';

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<(Certification & { id: string })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', imageUrl: '', order: 0 });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const data = await getDocuments<Certification>('certifications', orderBy('order', 'asc'));
    setCerts(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditingId(null); setForm({ title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', imageUrl: '', order: certs.length }); setIsModalOpen(true); };

  const openEdit = (c: Certification & { id: string }) => {
    setEditingId(c.id);
    setForm({
      title: c.title, issuer: c.issuer,
      issueDate: c.issueDate ? new Date(c.issueDate.seconds * 1000).toISOString().split('T')[0] : '',
      expiryDate: c.expiryDate ? new Date(c.expiryDate.seconds * 1000).toISOString().split('T')[0] : '',
      credentialId: c.credentialId, credentialUrl: c.credentialUrl, imageUrl: c.imageUrl, order: c.order,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        issueDate: form.issueDate ? Timestamp.fromDate(new Date(form.issueDate)) : null,
        expiryDate: form.expiryDate ? Timestamp.fromDate(new Date(form.expiryDate)) : null,
      };
      if (editingId) { await updateDocument('certifications', editingId, data); }
      else { await addDocument('certifications', data); }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      console.log('Attempting to delete certification with ID:', id);
      await deleteDocument('certifications', id);
      console.log('Certification deleted successfully, reloading list.');
      await fetchData();
    } catch (err) {
      console.error('Failed to delete certification:', err);
      alert('Error deleting certification: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Certifications</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your certifications.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Certification</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <Card key={c.id} hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[var(--color-text)]">{c.title}</h3>
                <p className="text-sm text-[var(--color-primary)]">{c.issuer}</p>
                {c.credentialId && <p className="text-xs text-[var(--color-text-muted)] mt-1">ID: {c.credentialId}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {certs.length === 0 && <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No certifications yet.</p></Card>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Certification' : 'Add Certification'}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} required />
          <Input label="Issuer" value={form.issuer} onChange={(e) => setForm(prev => ({ ...prev, issuer: e.target.value }))} placeholder="e.g., Google, AWS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Issue Date" type="date" value={form.issueDate} onChange={(e) => setForm(prev => ({ ...prev, issueDate: e.target.value }))} />
            <Input label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => setForm(prev => ({ ...prev, expiryDate: e.target.value }))} />
          </div>
          <Input label="Credential ID" value={form.credentialId} onChange={(e) => setForm(prev => ({ ...prev, credentialId: e.target.value }))} />
          <Input label="Credential URL" value={form.credentialUrl} onChange={(e) => setForm(prev => ({ ...prev, credentialUrl: e.target.value }))} />
          <ImageUploader bucket={SUPABASE_BUCKETS.CERTIFICATIONS} currentUrl={form.imageUrl} onUpload={(url) => setForm(prev => ({ ...prev, imageUrl: url }))} label="Certificate Image" />
          <Input label="Order" type="number" value={form.order.toString()} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))} />
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
