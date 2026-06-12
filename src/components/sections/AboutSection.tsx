'use client';

import { motion } from 'framer-motion';
import { User, Target, MapPin, Phone, Mail } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { UserProfile } from '@/lib/types';

interface AboutSectionProps {
  profile: UserProfile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  return (
    <SectionWrapper id="about" title="About Me" subtitle="Get to know me better">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Professional Summary */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="group p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-500/20 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
              <User size={20} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">Professional Summary</h3>
          </div>
          <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {profile.bio || 'A passionate developer dedicated to building impactful solutions.'}
          </p>
        </motion.div>

        {/* Career Objective */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
              <Target size={20} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">Career Objective</h3>
          </div>
          <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {profile.careerObjective || 'To leverage my skills to create innovative and scalable solutions.'}
          </p>
        </motion.div>
      </div>

      {/* Quick info chips */}
      {(profile.location || profile.phone || profile.email) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {profile.location && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
              <MapPin size={14} className="text-[var(--color-primary)]" /> {profile.location}
            </span>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30 transition-colors">
              <Phone size={14} className="text-[var(--color-primary)]" /> {profile.phone}
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30 transition-colors">
              <Mail size={14} className="text-[var(--color-primary)]" /> {profile.email}
            </a>
          )}
        </motion.div>
      )}
    </SectionWrapper>
  );
}
