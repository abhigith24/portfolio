'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, ChevronDown, Sparkles, FolderKanban, Award, GraduationCap, Code } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import type { UserProfile, SocialLink, Resume, Experience } from '@/lib/types';
import { getIconByName } from '@/lib/getIcon';

interface HeroSectionProps {
  profile: UserProfile | null;
  socialLinks: SocialLink[];
  defaultResume: Resume | null;
  projectsCount?: number;
  skillsCount?: number;
  experiences?: Experience[];
  certificationsCount?: number;
}

const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 2,
  delay: Math.random() * 5,
  duration: Math.random() * 6 + 6,
}));

function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end <= 0) return;
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 30);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function HeroSection({
  profile,
  socialLinks,
  defaultResume,
  projectsCount = 4,
  skillsCount = 10,
  experiences = [],
  certificationsCount = 5
}: HeroSectionProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  
  const roles = [
    'B.Tech CSE Graduate',
    'Aspiring QA Engineer',
    'Java Developer'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (iconName: string) => getIconByName(iconName, { size: 18 });

  const internshipCount = experiences.filter(e => e.type === 'internship').length || 1;

  const stats = [
    { label: 'Projects Completed', value: projectsCount || 4, suffix: '+', icon: FolderKanban },
    { label: 'Internships Done', value: internshipCount || 1, suffix: '+', icon: GraduationCap },
    { label: 'Technologies Used', value: skillsCount || 10, suffix: '+', icon: Code },
    { label: 'Certifications', value: certificationsCount || 5, suffix: '+', icon: Award },
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Animated premium blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[450px] h-[450px] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-blob"
          style={{ top: '8%', left: '-5%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 to-sky-500/5 rounded-full blur-3xl animate-blob"
          style={{ bottom: '15%', right: '-5%', animationDelay: '3s', animationDuration: '9s' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[var(--color-primary)]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0.15,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 10, -10, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full flex flex-col items-center">
        
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[var(--color-primary)]/20 text-xs text-[var(--color-primary)] font-semibold mb-6 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Available for Opportunities
        </motion.div>

        {/* Profile Image with subtle premium ring */}
        {profile?.photoURL ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] shadow-xl">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-[var(--color-bg)]">
                <Image
                  src={profile.photoURL}
                  alt={profile.displayName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-inner">
                {(profile?.displayName || 'D')[0].toUpperCase()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-text)] mb-3 tracking-tight leading-none"
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text-animated">{profile?.displayName || 'Abhigith'}</span>
        </motion.h1>

        {/* Animated Role Underlined */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="h-10 mb-4 flex items-center justify-center"
        >
          <motion.div
            key={currentRoleIndex}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <p className="text-xl md:text-2xl text-[var(--color-primary)] font-bold tracking-tight">
              {roles[currentRoleIndex]}
            </p>
          </motion.div>
        </motion.div>

        {/* Bio / Title */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-lg md:text-xl text-[var(--color-text-secondary)] font-normal max-w-2xl mx-auto leading-relaxed mb-4 text-balance"
        >
          Building reliable software through testing, automation and modern web technologies.
        </motion.p>

        {/* Location */}
        {profile?.location && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-xs text-[var(--color-text-muted)] mb-8 flex items-center gap-1.5"
          >
            <MapPin size={13} className="text-[var(--color-primary)]" />
            {profile.location}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center mb-8 w-full max-w-md"
        >
          <Button size="lg" onClick={() => handleScrollTo('projects')} className="w-full sm:w-auto">
            View Projects
          </Button>
          <Button variant="outline" size="lg" onClick={() => handleScrollTo('contact')} className="w-full sm:w-auto">
            <Mail size={16} />
            Contact Me
          </Button>
          {defaultResume && (
            <a href={defaultResume.fileUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                <Download size={16} />
                Resume
              </Button>
            </a>
          )}
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center gap-3 mb-12"
        >
          {socialLinks.filter(l => l.isVisible).map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 200 }}
              className="p-2.5 rounded-xl glass text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:scale-105 hover:shadow-md transition-all duration-300 hover:border-[var(--color-primary)]/20"
              aria-label={link.platform}
            >
              {getIcon(link.icon)}
            </motion.a>
          ))}
        </motion.div>

        {/* Dynamic Recruiter Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 px-2"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-4 rounded-2xl glass border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 transition-all duration-300 hover:shadow-md hover:shadow-[var(--color-primary)]/5"
              >
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/5 text-[var(--color-primary)] mb-2">
                  <Icon size={16} />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-text)]">
                  <AnimatedCounter value={stat.value} />
                  <span className="text-[var(--color-primary)]">{stat.suffix}</span>
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Down Chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => handleScrollTo('about')}
          className="flex flex-col items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group cursor-pointer"
        >
          <span className="text-xs font-semibold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
