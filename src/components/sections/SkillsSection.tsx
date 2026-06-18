'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { Skill } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SkillsSectionProps {
  skills: Skill[];
}

// Icon mappings for specific skills to ensure premium appearance
const skillIcons: Record<string, string> = {
  java: '☕',
  html: '🌐',
  css: '🎨',
  javascript: '🟨',
  js: '🟨',
  react: '⚛️',
  mysql: '🗄️',
  firebase: '🔥',
  'manual testing': '📋',
  testing: '📋',
  selenium: '🤖',
  postman: '🚀',
  testng: '🚦',
  git: '🌿',
  github: '🐙',
  'vs code': '💻',
  vscode: '💻'
};

const normalizeCategory = (cat: string): string => {
  const c = cat.toLowerCase().trim();
  if (c === 'programming' || c === 'languages' || c === 'backend' || c === 'java') return 'Programming';
  if (c === 'testing' || c === 'qa' || c === 'automation' || c === 'manual testing' || c === 'selenium') return 'Testing';
  if (c === 'frontend' || c === 'frameworks') return 'Frontend';
  if (c === 'database' || c === 'mysql') return 'Database';
  if (c === 'tools' || c === 'devops') return 'Tools';
  return 'Other';
};

const categoryDescriptions: Record<string, string> = {
  Programming: 'Core languages and backend development systems',
  Testing: 'Automated suites, manual verification, and QA protocols',
  Frontend: 'Responsive web frameworks and user interfaces',
  Database: 'Data storage, validation, and relational structures',
  Tools: 'Development environments, version control, and utilities',
  Other: 'Additional technical competencies'
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('All');

  // Split and normalize skills
  const normalizedSkills = useMemo(() => {
    return skills.flatMap((skill) => {
      const names = skill.name.split(',').map(n => n.trim()).filter(Boolean);
      return names.map((name, nameIdx) => {
        const key = name.toLowerCase();
        const icon = skillIcons[key] || skill.icon || '⚡';
        const normalizedCat = normalizeCategory(skill.category);
        return {
          ...skill,
          id: `${skill.id}-${nameIdx}`,
          name,
          icon,
          normalizedCategory: normalizedCat
        };
      });
    }).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [skills]);

  // Extract unique categories available (plus "All")
  const categories = useMemo(() => {
    const cats = new Set<string>();
    normalizedSkills.forEach(s => cats.add(s.normalizedCategory));
    return ['All', ...Array.from(cats).sort()];
  }, [normalizedSkills]);

  // Filter skills based on tab
  const filteredSkills = useMemo(() => {
    if (activeTab === 'All') return normalizedSkills;
    return normalizedSkills.filter(s => s.normalizedCategory === activeTab);
  }, [normalizedSkills, activeTab]);

  return (
    <SectionWrapper id="skills" title="My Skills" subtitle="Core technologies, QA testing suites, and development tools I work with">
      
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer border',
              activeTab === cat
                ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-transparent shadow-md'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]/20 hover:text-[var(--color-text)]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category Description */}
      {activeTab !== 'All' && categoryDescriptions[activeTab] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-[var(--color-text-muted)] font-medium mb-8 uppercase tracking-wider"
        >
          {categoryDescriptions[activeTab]}
        </motion.p>
      )}

      {/* Grid showing filtered skills */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="group flex flex-col p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 hover:shadow-md hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
            >
              {/* Header inside Card */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl leading-none">{skill.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-[var(--color-text)] truncate">
                    {skill.name}
                  </h4>
                  <span className="inline-block text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    {skill.normalizedCategory}
                  </span>
                </div>
              </div>

              {/* Proficiency Progress Bar */}
              <div className="mt-auto pt-3 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-[var(--color-text-muted)] font-semibold">Proficiency</span>
                  <span className="text-[var(--color-primary)] font-extrabold">{skill.proficiency}%</span>
                </div>
                <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Summary Stat */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-xs text-[var(--color-text-muted)] mt-10"
      >
        Showing {filteredSkills.length} of {normalizedSkills.length} total core competencies
      </motion.p>

    </SectionWrapper>
  );
}
