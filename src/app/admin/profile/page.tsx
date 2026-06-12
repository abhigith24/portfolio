'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getDocument } from '@/lib/firebase/firestore';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ImageUploader from '@/components/admin/ImageUploader';
import { SUPABASE_BUCKETS } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    title: '',
    roles: '',
    bio: '',
    careerObjective: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await getDocument<UserProfile>('users', 'main');
      if (data) {
        setForm({
          displayName: data.displayName || '',
          email: data.email || '',
          photoURL: data.photoURL || '',
          title: data.title || '',
          roles: (data.roles || []).join(', '),
          bio: data.bio || '',
          careerObjective: data.careerObjective || '',
          phone: data.phone || '',
          location: data.location || '',
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'users', 'main');
      await setDoc(docRef, {
        ...form,
        roles: form.roles.split(',').map(r => r.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-[var(--color-surface)] rounded w-48" /><div className="h-64 bg-[var(--color-surface)] rounded-2xl" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Profile</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage your personal information.</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save size={16} /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo Upload */}
        <Card hover={false}>
          <ImageUploader
            bucket={SUPABASE_BUCKETS.PROFILE}
            currentUrl={form.photoURL}
            onUpload={(url) => setForm(prev => ({ ...prev, photoURL: url }))}
            label="Profile Photo"
            aspectRatio="aspect-square"
          />
        </Card>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-4">
          <Card hover={false}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Display Name" value={form.displayName} onChange={(e) => setForm(prev => ({ ...prev, displayName: e.target.value }))} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <Input label="Title" placeholder="e.g., Full Stack Developer" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} />
              <Input label="Roles (comma-separated)" placeholder="e.g., Developer, Designer, Freelancer" value={form.roles} onChange={(e) => setForm(prev => ({ ...prev, roles: e.target.value }))} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Phone" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} />
                <Input label="Location" value={form.location} onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} />
              </div>
              <Textarea label="Professional Summary (Bio)" value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} rows={5} />
              <Textarea label="Career Objective" value={form.careerObjective} onChange={(e) => setForm(prev => ({ ...prev, careerObjective: e.target.value }))} rows={4} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
