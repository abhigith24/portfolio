'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star, StarOff } from 'lucide-react';
import { getDocuments, addDocument, updateDocument, deleteDocument, orderBy } from '@/lib/firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ImageUploader from '@/components/admin/ImageUploader';
import { SUPABASE_BUCKETS, PROJECT_CATEGORIES } from '@/lib/constants';
import type { Project } from '@/lib/types';

const emptyProject = {
  title: '', description: '', longDescription: '', technologies: '',
  githubUrl: '', liveUrl: '', thumbnail: '', images: [] as string[],
  featured: false, order: 0, category: 'Web App', status: 'completed' as 'completed' | 'in-progress',
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<(Project & { id: string })[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    const data = await getDocuments<Project>('projects', orderBy('order', 'asc'));
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyProject, order: projects.length });
    setIsModalOpen(true);
  };

  const openEdit = (p: Project & { id: string }) => {
    setEditingId(p.id);
    setForm({
      title: p.title, description: p.description, longDescription: p.longDescription,
      technologies: p.technologies.join(', '), githubUrl: p.githubUrl, liveUrl: p.liveUrl,
      thumbnail: p.thumbnail, images: p.images, featured: p.featured, order: p.order,
      category: p.category, status: p.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDocument('projects', editingId, data);
      } else {
        await addDocument('projects', data);
      }
      await fetchProjects();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteDocument('projects', id);
    await fetchProjects();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await updateDocument('projects', id, { featured: !current });
    await fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Projects</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <Card key={p.id} hover={false}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[var(--color-text)] truncate">{p.title}</h3>
                  {p.featured && <Badge variant="primary" size="sm"><Star size={10} className="fill-current" /> Featured</Badge>}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.technologies.slice(0, 3).map(t => <Badge key={t} size="sm">{t}</Badge>)}
                </div>
              </div>
              <div className="flex gap-1 ml-3">
                <button onClick={() => toggleFeatured(p.id, p.featured)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-amber-500 transition-colors cursor-pointer" title="Toggle featured">
                  {p.featured ? <Star size={16} className="fill-amber-500 text-amber-500" /> : <StarOff size={16} />}
                </button>
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card hover={false}><p className="text-center text-[var(--color-text-muted)] py-8">No projects yet. Add your first project!</p></Card>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Project' : 'Add Project'} size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} required />
          <Textarea label="Short Description" value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
          <Textarea label="Long Description" value={form.longDescription} onChange={(e) => setForm(prev => ({ ...prev, longDescription: e.target.value }))} rows={5} />
          <Input label="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm(prev => ({ ...prev, technologies: e.target.value }))} placeholder="React, Node.js, TypeScript" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm(prev => ({ ...prev, githubUrl: e.target.value }))} />
            <Input label="Live Demo URL" value={form.liveUrl} onChange={(e) => setForm(prev => ({ ...prev, liveUrl: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)]">
                {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as 'completed' | 'in-progress' }))} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)]">
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <Input label="Order" type="number" value={form.order.toString()} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))} />
          </div>
          <ImageUploader bucket={SUPABASE_BUCKETS.PROJECTS} currentUrl={form.thumbnail} onUpload={(url) => setForm(prev => ({ ...prev, thumbnail: url }))} label="Thumbnail" />
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>{editingId ? 'Update' : 'Create'} Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
