'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export default function SectionWrapper({ children, id, className, title, subtitle, badge }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      id={id}
      className={cn('section-padding relative overflow-hidden', className)}
    >
      {/* Subtle background mesh per section */}
      <div className="absolute inset-0 mesh-bg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8"
      >
        {(title || subtitle || badge) && (
          <div className="text-center mb-14">
            {/* Badge */}
            {badge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 mb-4"
              >
                {badge}
              </motion.span>
            )}

            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-4"
              >
                {title.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i} className="gradient-text">{word}</span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </motion.h2>
            )}

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-16 h-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] mx-auto mb-4"
            />

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto text-balance"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
