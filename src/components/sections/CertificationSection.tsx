'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { Certification } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface CertificationSectionProps {
  certifications: Certification[];
}

export default function CertificationSection({ certifications }: CertificationSectionProps) {
  const sorted = [...certifications].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper id="certifications" title="Certifications" subtitle="Professional certifications and achievements">
      <div className="flex flex-wrap justify-center gap-6">
        {sorted.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="w-full max-w-sm"
          >
            <div className="group relative p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:shadow-xl hover:shadow-[var(--color-primary)]/5 hover:-translate-y-1 hover:border-[var(--color-primary)]/20 transition-all duration-300">
              {/* Certificate Image */}
              {cert.imageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              {/* Icon */}
              {!cert.imageUrl && (
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4">
                  <Award size={24} />
                </div>
              )}

              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                {cert.title}
              </h3>
              <p className="text-sm text-[var(--color-primary)] font-medium mb-2">{cert.issuer}</p>

              <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mb-4">
                <Calendar size={12} />
                <span>Issued: {formatDate(cert.issueDate)}</span>
                {cert.expiryDate && <span> · Expires: {formatDate(cert.expiryDate)}</span>}
              </div>

              {cert.credentialId && (
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  ID: {cert.credentialId}
                </p>
              )}

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
                >
                  <ExternalLink size={14} />
                  View Credential
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
