'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { SOCIAL_PLATFORMS } from '@/lib/constants';
import type { SocialLink } from '@/lib/types';

export default function AdminSocialPage() {
  const [links, setLinks] = useState<(SocialLink & { id: string })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: 'github', url: '', icon: 'Github', order: 0, isVisible: true });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const data = await getDocuments<SocialLink>('socialLinks', orderBy('order', 'asc'));
    setLinks(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditingId(null); setForm({ platform: 'github', url: '', icon: 'Github', order: links.length, isVisible: true }); setIsModalOpen(true); };

  const openEdit = (l: SocialLink & { id: string }) => {
    setEditingId(l.id);
    setForm({ platform: l.platform, url: l.url, icon: l.icon, order: l.order, isVisible: l.isVisible });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) { await updateDocument('socialLinks', editingId, form); }
      else { await addDocument('socialLinks', form); }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return;
    await deleteDocument('socialLinks', id);
    await fetchData();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await updateDocument('socialLinks', id, { isVisible: !current });
    await fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Social Links</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your social media profiles.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Link</Button>
      </div>

      <div className="space-y-3">
        {links.map((l) => (
          <Card key={l.id} hover={false}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-text)] capitalize">{l.platform}</span>
                <span className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{l.url}</span>
                {!l.isVisible && <span className="text-xs text-[var(--color-text-muted)]">(hidden)</span>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleVisibility(l.id, l.isVisible)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors cursor-pointer">
                  {l.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {links.length === 0 && <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No social links yet.</p></Card>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Social Link' : 'Add Social Link'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Platform</label>
            <select value={form.platform} onChange={(e) => {
              const p = SOCIAL_PLATFORMS.find(p => p.value === e.target.value);
              setForm(prev => ({ ...prev, platform: e.target.value, icon: p?.icon || 'Globe' }));
            }} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)]">
              {SOCIAL_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <Input label="URL" value={form.url} onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))} placeholder="https://..." required />
          <Input label="Order" type="number" value={form.order.toString()} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))} />
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
            <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm(prev => ({ ...prev, isVisible: e.target.checked }))} className="accent-[var(--color-primary)]" />
            Visible on portfolio
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
