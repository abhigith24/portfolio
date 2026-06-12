'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getDocument } from '@/lib/firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { DEFAULT_ENABLED_SECTIONS, DEFAULT_SEO } from '@/lib/constants';
import type { SeoSettings, GeneralSettings, EnabledSections } from '@/lib/types';

export default function AdminSettingsPage() {
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO);
  const [sections, setSections] = useState<EnabledSections>(DEFAULT_ENABLED_SECTIONS);
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', address: '' });
  const [footerText, setFooterText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const [seoData, generalData] = await Promise.all([
        getDocument<SeoSettings>('settings', 'seo'),
        getDocument<GeneralSettings>('settings', 'general'),
      ]);
      if (seoData) setSeo(seoData);
      if (generalData) {
        setSections(generalData.enabledSections || DEFAULT_ENABLED_SECTIONS);
        setContactInfo(generalData.contactInfo || { email: '', phone: '', address: '' });
        setFooterText(generalData.footerText || '');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'settings', 'seo'), seo, { merge: true }),
        setDoc(doc(db, 'settings', 'general'), {
          enabledSections: sections,
          contactInfo,
          footerText,
        }, { merge: true }),
      ]);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const sectionNames: (keyof EnabledSections)[] = ['hero', 'about', 'skills', 'projects', 'experience', 'certifications', 'resume', 'contact'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Configure SEO, sections, and site settings.</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}><Save size={16} /> Save All</Button>
      </div>

      <div className="space-y-6">
        {/* SEO Settings */}
        <Card hover={false}>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">SEO Metadata</h2>
          <div className="space-y-4">
            <Input label="Site Title" value={seo.siteTitle} onChange={(e) => setSeo(prev => ({ ...prev, siteTitle: e.target.value }))} />
            <Textarea label="Site Description" value={seo.siteDescription} onChange={(e) => setSeo(prev => ({ ...prev, siteDescription: e.target.value }))} rows={3} />
            <Input label="Site URL" value={seo.siteUrl} onChange={(e) => setSeo(prev => ({ ...prev, siteUrl: e.target.value }))} placeholder="https://yourdomain.com" />
            <Input label="OG Image URL" value={seo.ogImage} onChange={(e) => setSeo(prev => ({ ...prev, ogImage: e.target.value }))} />
            <Input label="Keywords (comma-separated)" value={(seo.keywords || []).join(', ')} onChange={(e) => setSeo(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()) }))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Author" value={seo.author} onChange={(e) => setSeo(prev => ({ ...prev, author: e.target.value }))} />
              <Input label="Twitter Handle" value={seo.twitterHandle} onChange={(e) => setSeo(prev => ({ ...prev, twitterHandle: e.target.value }))} placeholder="@handle" />
            </div>
          </div>
        </Card>

        {/* Section Toggles */}
        <Card hover={false}>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Section Visibility</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sectionNames.map((key) => (
              <label key={key} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer hover:border-[var(--color-primary)]/30 transition-all">
                <input
                  type="checkbox"
                  checked={sections[key]}
                  onChange={(e) => setSections(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="accent-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-text)] capitalize">{key}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Contact Info */}
        <Card hover={false}>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Email" value={contactInfo.email} onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))} />
            <Input label="Phone" value={contactInfo.phone} onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))} />
            <Input label="Address" value={contactInfo.address} onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))} />
          </div>
        </Card>

        {/* Footer */}
        <Card hover={false}>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Footer</h2>
          <Textarea label="Footer Text" value={footerText} onChange={(e) => setFooterText(e.target.value)} rows={3} placeholder="Custom footer text..." />
        </Card>
      </div>
    </div>
  );
}
