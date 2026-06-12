'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { Skill } from '@/lib/types';

interface SkillsSectionProps {
  skills: Skill[];
}

const catConfig: Record<string, { bar: string; pill: string; label: string; dot: string }> = {
  Frontend:   { bar: 'from-violet-500 to-indigo-500', pill: 'bg-violet-500/10 border-violet-500/25 text-violet-700 dark:text-violet-300', label: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  Backend:    { bar: 'from-blue-500 to-cyan-500',     pill: 'bg-blue-500/10 border-blue-500/25 text-blue-700 dark:text-blue-300',         label: 'text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500' },
  Database:   { bar: 'from-emerald-500 to-teal-500',  pill: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300', label: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  DevOps:     { bar: 'from-orange-500 to-amber-500',  pill: 'bg-orange-500/10 border-orange-500/25 text-orange-700 dark:text-orange-300', label: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
  Tools:      { bar: 'from-pink-500 to-rose-500',     pill: 'bg-pink-500/10 border-pink-500/25 text-pink-700 dark:text-pink-300',         label: 'text-pink-600 dark:text-pink-400',   dot: 'bg-pink-500' },
  Languages:  { bar: 'from-purple-500 to-fuchsia-500',pill: 'bg-purple-500/10 border-purple-500/25 text-purple-700 dark:text-purple-300', label: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  Frameworks: { bar: 'from-sky-500 to-blue-500',      pill: 'bg-sky-500/10 border-sky-500/25 text-sky-700 dark:text-sky-300',             label: 'text-sky-600 dark:text-sky-400',     dot: 'bg-sky-500' },
  Other:      { bar: 'from-gray-400 to-slate-500',    pill: 'bg-gray-500/10 border-gray-500/25 text-gray-700 dark:text-gray-300',         label: 'text-gray-600 dark:text-gray-400',   dot: 'bg-gray-400' },
};
const getCat = (cat: string) =>
  catConfig[cat] ?? catConfig.Other;

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  // Calculate total individual skills across all categories
  const totalSkillsCount = skills.reduce((acc, skill) => {
    const names = skill.name.split(',').map(n => n.trim()).filter(Boolean);
    return acc + names.length;
  }, 0);

  return (
    <SectionWrapper id="skills" title="My Skills" subtitle="Technologies and tools I work with">
      <div className="space-y-5">
        {categories.map((cat, catIdx) => {
          const cfg = getCat(cat);
          const catSkills = grouped[cat].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          // Split any comma-separated skill names into separate virtual skill items
          const splitSkills = catSkills.flatMap((skill) => {
            const names = skill.name.split(',').map(n => n.trim()).filter(Boolean);
            return names.map((name, nameIdx) => ({
              ...skill,
              name,
              id: `${skill.id}-${nameIdx}`
            }));
          });

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: catIdx * 0.06 }}
              className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 hover:shadow-lg hover:shadow-[var(--color-primary)]/5 transition-all duration-300"
            >
              {/* Category label — fixed width column on desktop */}
              <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1.5 sm:w-28 sm:shrink-0 sm:pt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                <span className={`text-sm font-bold ${cfg.label} leading-tight`}>{cat}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium sm:block hidden">
                  {splitSkills.length} skill{splitSkills.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Divider — vertical on desktop, hidden on mobile */}
              <div className="hidden sm:block w-px self-stretch bg-[var(--color-border)] shrink-0" />

              {/* Skills pills row — wraps on small screens */}
              <div className="flex flex-wrap gap-2 flex-1">
                {splitSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: catIdx * 0.06 + idx * 0.04 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                  >
                    <div
                      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium cursor-default transition-all duration-200 hover:shadow-md ${cfg.pill}`}
                    >
                      {/* Icon / emoji */}
                      <span className="text-base leading-none">{skill.icon}</span>
                      <span className="leading-none">{skill.name}</span>

                      {/* Proficiency dot indicator */}
                      <span
                        className="relative w-5 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden ml-1 hidden sm:block"
                        title={`${skill.proficiency}%`}
                      >
                        <span
                          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${cfg.bar}`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total skills count */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-xs text-[var(--color-text-muted)] mt-8"
      >
        {totalSkillsCount} skills across {categories.length} categories
      </motion.p>
    </SectionWrapper>
  );
}
