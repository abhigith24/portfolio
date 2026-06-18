'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { addDocument } from '@/lib/firebase/firestore';
import type { SocialLink, ContactInfo } from '@/lib/types';
import { getIconByName } from '@/lib/getIcon';

interface ContactSectionProps {
  socialLinks: SocialLink[];
  contactInfo: ContactInfo | null;
}

export default function ContactSection({ socialLinks, contactInfo }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const getIcon = (iconName: string) => getIconByName(iconName, { size: 18 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Save to Firestore
      await addDocument('contactMessages', {
        ...formData,
        isRead: false,
      });

      // Send via Web3Forms
      const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (web3formsKey) {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey,
            ...formData,
          }),
        });
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <SectionWrapper id="contact" title="Get In Touch" subtitle="Let's connect and build something amazing together">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-3">
          <Card hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <Input
                label="Subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
              />
              <Textarea
                label="Message"
                placeholder="Tell me more about your project or idea..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
                rows={5}
              />

              <Button
                type="submit"
                size="lg"
                isLoading={status === 'sending'}
                className="w-full"
              >
                <Send size={18} />
                Send Message
              </Button>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 rounded-xl p-3"
                >
                  <CheckCircle size={16} />
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 rounded-xl p-3"
                >
                  <AlertCircle size={16} />
                  Something went wrong. Please try again.
                </motion.div>
              )}
            </form>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-4">
          {contactInfo?.email && (
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">Email</h4>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </Card>
          )}

          {contactInfo?.phone && (
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">Phone</h4>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </Card>
          )}

          {contactInfo?.address && (
            <Card>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">Location</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">{contactInfo.address}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Social Links */}
          {socialLinks.filter(l => l.isVisible).length > 0 && (
            <Card>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Follow Me</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.filter(l => l.isVisible).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all duration-200"
                    aria-label={link.platform}
                  >
                    {getIcon(link.icon)}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
