'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Building2, Briefcase, Award } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Badge from '@/components/ui/Badge';
import type { Experience } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const typeColors = {
  job:        { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', icon: Briefcase },
  internship: { bg: 'bg-blue-500/10',  text: 'text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500', icon: GraduationCap },
  training:   { bg: 'bg-sky-500/10',   text: 'text-sky-600 dark:text-sky-400',     dot: 'bg-sky-500', icon: Award },
};

// Simple icon mappings
function GraduationCap({ size, className }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
    </svg>
  );
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper id="experience" title="Professional Experience" subtitle="My internships, training milestones, and professional journey">
      <div className="relative max-w-3xl mx-auto">
        
        {/* Timeline track vertical line - perfectly aligned for small and large viewports */}
        <div className="absolute left-4 sm:left-6 top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-border)] to-transparent" />

        <div className="space-y-8">
          {sorted.map((exp, idx) => {
            const colors = typeColors[exp.type] ?? typeColors.internship;
            const Icon = colors.icon;
            
            // Format descriptions into paragraphs or bullet list items if they contain newlines or dots
            const descriptionLines = exp.description
              ? exp.description.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
              : [];

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="relative flex gap-4 sm:gap-6 pl-8 sm:pl-14"
              >
                {/* Custom timeline circle icon */}
                <div className={`absolute left-1.5 sm:left-3.5 top-5 w-5 h-5 rounded-full ${colors.dot} border-4 border-[var(--color-bg)] flex items-center justify-center text-white shadow-md z-10`} />

                {/* Main Card Container */}
                <div className="flex-1 group p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-all duration-300">
                  
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] leading-tight">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 size={13} className="text-[var(--color-primary)] shrink-0" />
                        <span className="text-[var(--color-primary)] font-bold text-xs sm:text-sm">
                          {exp.company}
                        </span>
                      </div>
                    </div>
                    
                    {/* Badge Tags */}
                    <div className="flex flex-wrap gap-1.5 shrink-0 items-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        <Icon size={10} />
                        {exp.type}
                      </span>
                      {exp.isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata: Calendar & Location */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)] font-medium mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {/* Description List */}
                  {descriptionLines.length > 0 && (
                    <div className="mb-4">
                      <ul className="space-y-2">
                        {descriptionLines.map((line, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/50 mt-2 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stacks used badges */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--color-border)]">
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
