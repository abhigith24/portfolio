'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, Building2 } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Badge from '@/components/ui/Badge';
import type { Experience } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const typeColors = {
  job:        { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  internship: { bg: 'bg-violet-500/10',  text: 'text-violet-600 dark:text-violet-400',   dot: 'bg-violet-500' },
  training:   { bg: 'bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400',     dot: 'bg-amber-500' },
};

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper id="experience" title="Experience" subtitle="My professional journey and growth">
      <div className="relative max-w-3xl mx-auto">
        {/* Vertical timeline line — left side always for mobile, hidden on desktop where we use the card approach */}
        <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-border)] to-transparent" />

        <div className="space-y-6 sm:space-y-8">
          {sorted.map((exp, idx) => {
            const colors = typeColors[exp.type] ?? typeColors.internship;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex gap-4 sm:gap-6 pl-12 sm:pl-14"
              >
                {/* Timeline dot */}
                <div className={`absolute left-3.5 sm:left-4 top-5 w-4 h-4 rounded-full ${colors.dot} border-4 border-[var(--color-bg)] shadow-lg z-10`} />

                {/* Card */}
                <div className="flex-1 group p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:shadow-xl hover:shadow-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/20 transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] leading-tight">{exp.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 size={13} className="text-[var(--color-primary)] shrink-0" />
                        <p className="text-[var(--color-primary)] font-semibold text-sm">{exp.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      <span className={`inline-block text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        {exp.type}
                      </span>
                      {exp.isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Current
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {exp.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">{exp.description}</p>
                  )}

                  {/* Tech badges */}
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} size="sm">{tech}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
