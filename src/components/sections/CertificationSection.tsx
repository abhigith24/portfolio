'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';
import type { Certification } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CertificationSectionProps {
  certifications: Certification[];
}

export default function CertificationSection({ certifications }: CertificationSectionProps) {
  const sorted = [...certifications].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper id="certifications" title="Certifications" subtitle="My verified professional certifications and technical achievements">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="group flex flex-col p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-all duration-300"
          >
            {/* Cert Image Thumbnail */}
            {cert.imageUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[var(--color-border)]">
                <Image
                  src={cert.imageUrl}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]/5 text-[var(--color-primary)] mb-4">
                <Award size={22} />
              </div>
            )}

            {/* Cert Info */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-1">
                {cert.title}
              </h3>
              <p className="text-sm text-[var(--color-primary)] font-bold mb-3">{cert.issuer}</p>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-3">
                <Calendar size={13} className="shrink-0" />
                <span>Issued: {formatDate(cert.issueDate)}</span>
                {cert.expiryDate && <span> · Expires: {formatDate(cert.expiryDate)}</span>}
              </div>

              {/* Credential ID */}
              {cert.credentialId && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-5">
                  <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                  <span>Credential ID: <code className="font-mono bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">{cert.credentialId}</code></span>
                </div>
              )}

              {/* Verification Button */}
              {cert.credentialUrl && (
                <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    aria-label={`Verify credential for ${cert.title}`}
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      <ExternalLink size={13} />
                      Verify Credential
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
