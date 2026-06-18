'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Briefcase, Compass, CheckCircle } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input, { Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import type { TimelineItem } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';

const ICON_MAP = {
  education: GraduationCap,
  work: Briefcase,
  project: Compass,
  success: CheckCircle,
};

const ICON_OPTIONS = [
  { value: 'education', label: '🎓 Education / Degree' },
  { value: 'work', label: '💼 Job / Internship' },
  { value: 'project', label: '🧭 Project / Milestones' },
  { value: 'success', label: '✅ Success / Achievement' },
];

export default function AdminTimelinePage() {
  const [items, setItems] = useState<(TimelineItem & { id: string })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ year: '', title: '', description: '', icon: 'education', order: 0 });
  const [saving, setSaving] = useState(false);
  const [deletingItem, setDeletingItem] = useState<(TimelineItem & { id: string }) | null>(null);

  const fetchTimeline = async () => {
    try {
      const data = await getDocuments<TimelineItem>('timeline', orderBy('order', 'asc'));
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch timeline items:', err);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ year: '', title: '', description: '', icon: 'education', order: items.length });
    setIsModalOpen(true);
  };

  const openEdit = (item: TimelineItem & { id: string }) => {
    setEditingId(item.id);
    setForm({
      year: item.year,
      title: item.title,
      description: item.description,
      icon: item.icon || 'education',
      order: item.order,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.year.trim() || !form.title.trim() || !form.description.trim()) {
      alert('Please fill out all required fields');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        year: form.year.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon,
        order: form.order,
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDocument('timeline', editingId, payload);
      } else {
        await addDocument('timeline', {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      await fetchTimeline();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save timeline item:', err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setSaving(true);
    try {
      await deleteDocument('timeline', deletingItem.id);
      await fetchTimeline();
      setDeletingItem(null);
    } catch (err) {
      console.error('Failed to delete timeline item:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Timeline & Milestones</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your educational and professional milestones.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Milestone</Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Compass;
          return (
            <Card key={item.id} hover={false} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-white bg-[var(--color-primary)] rounded-full">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-bold text-[var(--color-text)]">{item.title}</h4>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 whitespace-pre-wrap">{item.description}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">Order: {item.order}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    aria-label="Edit milestone"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Delete milestone"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {items.length === 0 && (
        <Card hover={false}>
          <p className="text-center text-[var(--color-text-muted)] py-8">No milestones yet.</p>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Milestone' : 'Add Milestone'}>
        <div className="space-y-4">
          <Input
            label="Year"
            value={form.year}
            onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))}
            placeholder="e.g. 2024"
            required
          />
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Completed B.Tech"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Provide a detailed description of this milestone..."
            required
          />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Icon Marker</label>
            <select
              value={form.icon}
              onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none transition-colors"
            >
              {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <Input
            label="Order"
            type="number"
            value={form.order.toString()}
            onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} title="Delete Milestone">
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Are you sure you want to delete the milestone <strong>{deletingItem?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="secondary" onClick={() => setDeletingItem(null)}>Cancel</Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete} isLoading={saving}>
              Delete Milestone
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
