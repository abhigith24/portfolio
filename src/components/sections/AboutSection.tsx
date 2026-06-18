'use client';

import { motion } from 'framer-motion';
import { User, Target, MapPin, Phone, Mail, GraduationCap, Compass, Briefcase, CheckCircle } from 'lucide-react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { UserProfile } from '@/lib/types';

interface AboutSectionProps {
  profile: UserProfile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (!profile) return null;

  const timelineItems = [
    {
      year: '2022',
      title: 'Started B.Tech CSE',
      description: 'Began Bachelor of Technology in Computer Science & Engineering, building fundamentals in algorithms, structures, and software engineering.',
      icon: GraduationCap,
      color: 'border-blue-500'
    },
    {
      year: '2024',
      title: 'Java Internship',
      description: 'Worked on Java development and testing. Gained hands-on experience writing scripts, diagnosing bugs, and working in engineering pipelines.',
      icon: Briefcase,
      color: 'border-indigo-500'
    },
    {
      year: '2025',
      title: 'CampusMart Project',
      description: 'Developed CampusMart. Built critical modules, automated testing infrastructure, conducted manual test suites, and validated user flows.',
      icon: Compass,
      color: 'border-cyan-500'
    },
    {
      year: '2026',
      title: 'Graduation',
      description: 'Completed B.Tech CSE. Eagerly seeking QA Engineer & Java Developer roles to deliver reliable software solutions.',
      icon: CheckCircle,
      color: 'border-emerald-500'
    }
  ];

  return (
    <SectionWrapper id="about" title="About Me" subtitle="My background, career goals, and professional milestones">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personal Card and Info */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Card 1: Professional Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1 group p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shrink-0">
                <User size={20} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">Professional Summary</h3>
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm whitespace-pre-line">
              {profile.bio || 'B.Tech CSE Graduate and aspiring QA Engineer & Java Developer. Deeply passionate about designing test automation pipelines, writing robust Java code, and validating software reliability.'}
            </p>
          </motion.div>

          {/* Card 2: Career Goal & Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 group p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <Target size={20} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">Career Goal & Education</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-bold">Degree</span>
                <p className="text-sm font-semibold text-[var(--color-text)] mt-0.5">Bachelor of Technology (B.Tech) in Computer Science & Engineering</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-bold">Focus Area</span>
                <p className="text-sm text-[var(--color-text-secondary)]">QA Automation, Manual Testing, Java Development, SQL Database Validation</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-bold">Goal</span>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {profile.careerObjective || 'To leverage Java proficiency and automation tools (Selenium, TestNG, Postman) to build secure, reliable, and user-centered software products.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick info chips */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
          >
            {profile.location && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm">
                <MapPin size={16} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[var(--color-text-secondary)] truncate">{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-elevated)] transition-all">
                <Mail size={16} className="text-[var(--color-primary)] shrink-0" />
                <span className="text-[var(--color-text-secondary)] truncate">{profile.email}</span>
              </a>
            )}
          </motion.div>

        </div>

        {/* Right Column: Timeline style layout */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          >
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-[var(--color-primary)]" />
              Timeline & Milestones
            </h3>
            
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
              {timelineItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* Circle icon marker */}
                    <div className="absolute -left-10 top-0.5 w-6 h-6 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] z-10 shadow-sm group-hover:scale-110 transition-transform duration-200">
                      <Icon size={12} />
                    </div>

                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-white bg-[var(--color-primary)] rounded-full mb-1">
                        {item.year}
                      </span>
                      <h4 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </SectionWrapper>
  );
}
