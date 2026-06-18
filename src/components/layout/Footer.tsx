'use client';

import { Heart } from 'lucide-react';
import { useVisitorCount } from '@/lib/hooks/useVisitorCount';
import { NAV_ITEMS } from '@/lib/constants';
import type { SocialLink } from '@/lib/types';
import { getIconByName } from '@/lib/getIcon';

interface FooterProps {
  socialLinks?: SocialLink[];
  footerText?: string;
}

export default function Footer({ socialLinks = [], footerText }: FooterProps) {
  const visitorCount = useVisitorCount();

  const getIcon = (iconName: string) => getIconByName(iconName, { size: 18 });

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold gradient-text mb-3">Portfolio</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {footerText || 'Built with passion and modern technologies. Always learning, always growing.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_ITEMS.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.filter(l => l.isVisible).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all duration-200"
                  aria-label={link.platform}
                >
                  {getIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            © {new Date().getFullYear()} All rights reserved. Made with
            <Heart size={12} className="text-red-500 fill-red-500" />
          </p>
          {visitorCount > 0 && (
            <p className="text-xs text-[var(--color-text-muted)]">
              👀 {visitorCount.toLocaleString()} visitors
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
