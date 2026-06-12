'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { SKILL_CATEGORIES } from '@/lib/constants';
import type { Skill } from '@/lib/types';

// Built-in categories (without "Other") + Custom option
const BASE_CATEGORIES = SKILL_CATEGORIES.filter(c => c !== 'Other');
const isCustomCategory = (cat: string) => !BASE_CATEGORIES.includes(cat as typeof BASE_CATEGORIES[number]);

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<(Skill & { id: string })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', category: 'Frontend', icon: '💻', proficiency: 80, order: 0 });
  const [customCategory, setCustomCategory] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    const data = await getDocuments<Skill>('skills', orderBy('order', 'asc'));
    setSkills(data);
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', category: 'Frontend', icon: '💻', proficiency: 80, order: skills.length });
    setCustomCategory('');
    setShowCustom(false);
    setIsModalOpen(true);
  };

  const openEdit = (s: Skill & { id: string }) => {
    setEditingId(s.id);
    const custom = isCustomCategory(s.category);
    setForm({ name: s.name, category: custom ? '__custom__' : s.category, icon: s.icon, proficiency: s.proficiency, order: s.order });
    setCustomCategory(custom ? s.category : '');
    setShowCustom(custom);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Resolve final category value
      const finalCategory = form.category === '__custom__'
        ? (customCategory.trim() || 'Other')
        : form.category;
      const payload = { ...form, category: finalCategory };
      if (editingId) { await updateDocument('skills', editingId, payload); }
      else { await addDocument('skills', payload); }
      await fetchSkills();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleCategoryChange = (val: string) => {
    setForm(prev => ({ ...prev, category: val }));
    setShowCustom(val === '__custom__');
    if (val !== '__custom__') setCustomCategory('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await deleteDocument('skills', id);
    await fetchSkills();
  };

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, (Skill & { id: string })[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Skills</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your technical skills.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Skill</Button>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((s) => (
              <Card key={s.id} hover={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{s.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{s.proficiency}%</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No skills yet.</p></Card>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none transition-colors"
            >
              {BASE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__custom__">✏️ Custom (type your own)...</option>
            </select>

            {/* Custom category text input */}
            {showCustom && (
              <div className="relative">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Testing, AI/ML, Cloud..."
                  autoFocus
                  className="w-full rounded-xl border-2 border-[var(--color-primary)]/60 bg-[var(--color-primary)]/5 px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] outline-none transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-primary)] font-semibold">CUSTOM</span>
              </div>
            )}
          </div>
          <Input label="Icon (emoji)" value={form.icon} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} placeholder="💻" />
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Proficiency: {form.proficiency}%</label>
            <input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => setForm(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))} className="w-full accent-[var(--color-primary)]" />
          </div>
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
