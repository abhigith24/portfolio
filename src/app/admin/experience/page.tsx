'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { EXPERIENCE_TYPES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import type { Experience } from '@/lib/types';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<(Experience & { id: string })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: 'internship', title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', technologies: '', order: 0 });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const data = await getDocuments<Experience>('experiences', orderBy('order', 'asc'));
    setExperiences(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditingId(null); setForm({ type: 'internship', title: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', technologies: '', order: experiences.length }); setIsModalOpen(true); };

  const openEdit = (e: Experience & { id: string }) => {
    setEditingId(e.id);
    setForm({
      type: e.type, title: e.title, company: e.company, location: e.location,
      startDate: e.startDate ? new Date(e.startDate.seconds * 1000).toISOString().split('T')[0] : '',
      endDate: e.endDate ? new Date(e.endDate.seconds * 1000).toISOString().split('T')[0] : '',
      isCurrent: e.isCurrent, description: e.description, technologies: e.technologies.join(', '), order: e.order,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        startDate: form.startDate ? Timestamp.fromDate(new Date(form.startDate)) : null,
        endDate: form.isCurrent ? null : (form.endDate ? Timestamp.fromDate(new Date(form.endDate)) : null),
      };
      if (editingId) { await updateDocument('experiences', editingId, data); }
      else { await addDocument('experiences', data); }
      await fetchData();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      console.log('Attempting to delete experience with ID:', id);
      await deleteDocument('experiences', id);
      console.log('Experience deleted successfully, reloading list.');
      await fetchData();
    } catch (err) {
      console.error('Failed to delete experience:', err);
      alert('Error deleting experience: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Experience</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your work experience.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Experience</Button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id} hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[var(--color-text)]">{exp.title}</h3>
                  <Badge variant={exp.type === 'job' ? 'success' : exp.type === 'internship' ? 'primary' : 'warning'} size="sm">{exp.type}</Badge>
                  {exp.isCurrent && <Badge variant="success" size="sm">Current</Badge>}
                </div>
                <p className="text-sm text-[var(--color-primary)]">{exp.company} · {exp.location}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatDate(exp.startDate)} — {formatDate(exp.endDate)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No experiences yet.</p></Card>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Experience' : 'Add Experience'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Type</label>
            <select value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)]">
              {EXPERIENCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <Input label="Title / Position" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company" value={form.company} onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))} />
            <Input label="Location" value={form.location} onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))} />
            {!form.isCurrent && <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))} />}
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
            <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm(prev => ({ ...prev, isCurrent: e.target.checked }))} className="accent-[var(--color-primary)]" />
            Currently working here
          </label>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={4} />
          <Input label="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm(prev => ({ ...prev, technologies: e.target.value }))} />
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
