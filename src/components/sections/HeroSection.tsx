'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import type { UserProfile, SocialLink, Resume } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

interface HeroSectionProps {
  profile: UserProfile | null;
  socialLinks: SocialLink[];
  defaultResume: Resume | null;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 6,
}));

export default function HeroSection({ profile, socialLinks, defaultResume }: HeroSectionProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const roles = profile?.roles || ['Developer'];

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];
    return Icon ? <Icon size={20} /> : null;
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-3xl animate-blob"
          style={{ top: '10%', left: '-10%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] bg-gradient-to-br from-pink-400/15 to-purple-400/15 rounded-full blur-3xl animate-blob"
          style={{ bottom: '10%', right: '-5%', animationDelay: '3s', animationDuration: '10s' }}
        />
        <div
          className="absolute w-[300px] h-[300px] bg-gradient-to-br from-indigo-400/15 to-violet-300/15 rounded-full blur-3xl animate-blob"
          style={{ top: '50%', right: '20%', animationDelay: '5s', animationDuration: '12s' }}
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
              opacity: 0.25,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 15, -15, 0],
              opacity: [0.15, 0.5, 0.15],
              scale: [1, 1.3, 1],
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

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full py-12 sm:py-16 pb-24 sm:pb-28">

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--color-primary)]/20 text-sm text-[var(--color-primary)] font-medium mb-8"
        >
          <Sparkles size={14} className="animate-pulse" />
          Available for opportunities
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Profile Photo */}
        {profile?.photoURL ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 blur-md opacity-60 scale-110 animate-pulse-glow" />
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-primary)]/40 animate-spin-slow" style={{ margin: '-8px' }} />
              {/* Photo */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-3 ring-white/80 dark:ring-white/10 shadow-2xl">
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 blur-md opacity-40 scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-primary)]/30 animate-spin-slow" style={{ margin: '-8px' }} />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 flex items-center justify-center shadow-2xl text-white text-4xl md:text-5xl font-bold">
                {(profile?.displayName || 'D')[0].toUpperCase()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-text)] mb-4 tracking-tight"
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text-animated">{profile?.displayName || 'Developer'}</span>
        </motion.h1>

        {/* Dynamic Role with animated underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-12 md:h-14 mb-4 flex items-center justify-center"
        >
          <motion.div
            key={currentRoleIndex}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <p className="text-2xl md:text-3xl text-[var(--color-primary)] font-semibold">
              {roles[currentRoleIndex]}
            </p>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.div>
        </motion.div>

        {/* Bio / Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base md:text-lg text-[var(--color-text-secondary)] mb-3 max-w-2xl mx-auto text-balance leading-relaxed"
        >
          {profile?.title || 'Full Stack Developer'}
        </motion.p>

        {/* Location */}
        {profile?.location && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-[var(--color-text-muted)] mb-8 flex items-center justify-center gap-1.5"
          >
            <MapPin size={13} className="text-[var(--color-primary)]" />
            {profile.location}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center mb-10"
        >
          {defaultResume && (
            <a href={defaultResume.fileUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Download size={18} />
                Download Resume
              </Button>
            </a>
          )}
          <a href="#contact">
            <Button variant="outline" size="lg">
              <Mail size={18} />
              Contact Me
            </Button>
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex justify-center gap-3"
        >
          {socialLinks.filter(l => l.isVisible).map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 200 }}
              className="p-3 rounded-xl glass text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:scale-110 hover:shadow-lg transition-all duration-300 hover:border-[var(--color-primary)]/30"
              aria-label={link.platform}
            >
              {getIcon(link.icon)}
            </motion.a>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-10 sm:mt-16 grid grid-cols-3 gap-2 sm:gap-4 max-w-xs sm:max-w-sm mx-auto"
        >
          {[
            { label: 'Projects', value: '10+' },
            { label: 'Skills', value: '20+' },
            { label: 'Experience', value: '1yr+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 sm:p-3 rounded-xl sm:rounded-2xl glass border border-[var(--color-border)]">
              <p className="text-base sm:text-xl font-bold gradient-text">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group">
          <span className="text-xs font-medium opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
