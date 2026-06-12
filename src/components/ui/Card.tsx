'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover = true, glass = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-[var(--color-border)] p-6 transition-all duration-300',
        glass
          ? 'glass'
          : 'bg-[var(--color-surface-elevated)]',
        hover && 'hover:shadow-xl hover:shadow-[var(--color-primary)]/5 hover:-translate-y-1 hover:border-[var(--color-primary)]/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
