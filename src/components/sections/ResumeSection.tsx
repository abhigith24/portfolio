'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import type { Resume } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ResumeSectionProps {
  resumes: Resume[];
}

export default function ResumeSection({ resumes }: ResumeSectionProps) {
  const defaultResume = resumes.find(r => r.isDefault) || resumes[0];
  const [activeResume, setActiveResume] = useState<Resume | null>(defaultResume || null);

  if (resumes.length === 0) return null;

  return (
    <SectionWrapper id="resume" title="My Resume" subtitle="View and download my resume">
      <div className="max-w-3xl mx-auto">
        {/* Resume Version Selector */}
        {resumes.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {resumes.map((resume) => (
              <button
                key={resume.id}
                onClick={() => setActiveResume(resume)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                  activeResume?.id === resume.id
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                )}
              >
                <FileText size={14} className="inline mr-1.5" />
                {resume.title}
                {resume.isDefault && ' ★'}
              </button>
            ))}
          </div>
        )}

        {activeResume && (
          <motion.div
            key={activeResume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Preview */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden mb-6">
              <iframe
                src={`${activeResume.fileUrl}#toolbar=0`}
                className="w-full h-[600px] md:h-[700px]"
                title={`Resume: ${activeResume.title}`}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <a href={activeResume.fileUrl} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Eye size={18} />
                  View Full Screen
                </Button>
              </a>
              <a href={activeResume.fileUrl} download={activeResume.fileName}>
                <Button variant="outline">
                  <Download size={18} />
                  Download PDF
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
}
