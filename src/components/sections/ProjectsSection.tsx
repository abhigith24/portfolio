'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ImageGallery from '@/components/ui/ImageGallery';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Get unique technologies (no "All" option)
  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(p => p.technologies.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  // Filter projects — null = show all
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => activeTech === null || p.technologies.includes(activeTech))
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.order - b.order;
      });
  }, [projects, activeTech]);

  return (
    <SectionWrapper id="projects" title="My Projects" subtitle="Explore my recent work and contributions">

      {/* Tech Filter — only if more than 1 project */}
      {projects.length > 1 && allTechs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {/* Clear filter chip */}
          {activeTech && (
            <button
              onClick={() => setActiveTech(null)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer bg-[var(--color-primary)] text-white transition-all duration-200"
            >
              ✕ Clear
            </button>
          )}
          {allTechs.slice(0, 12).map((tech) => (
            <button
              key={tech}
              onClick={() => setActiveTech(prev => prev === tech ? null : tech)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                activeTech === tech
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
              )}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* Projects — flex-wrap + justify-center → single card centers, multiple fill rows */}
      <div className="flex flex-wrap justify-center gap-6">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] min-w-0"
          >
            <div
              onClick={() => setSelectedProject(project)}
              className="group relative h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden hover:shadow-xl hover:shadow-[var(--color-primary)]/8 hover:-translate-y-1 hover:border-[var(--color-primary)]/25 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="primary" size="sm">
                    <Star size={11} className="mr-1 fill-current" /> Featured
                  </Badge>
                </div>
              )}

              {/* Thumbnail */}
              {project.thumbnail && (
                <div className="relative aspect-video overflow-hidden shrink-0">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2 flex-1">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} size="sm">{tech}</Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge size="sm">+{project.technologies.length - 4}</Badge>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-4 mt-auto pt-3 border-t border-[var(--color-border)]">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-medium"
                    >
                      <Github size={13} /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors font-medium"
                    >
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <p>No projects found for this technology.</p>
          <button onClick={() => setActiveTech(null)} className="mt-3 text-sm text-[var(--color-primary)] hover:underline cursor-pointer">
            Show all projects
          </button>
        </div>
      )}

      {/* Project Detail Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-6">
            {selectedProject.images.length > 0 && (
              <ImageGallery images={selectedProject.images} alt={selectedProject.title} />
            )}
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2 uppercase tracking-wider">Description</h4>
              <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {selectedProject.longDescription || selectedProject.description}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-2 uppercase tracking-wider">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <Badge key={tech} variant="primary" size="md">{tech}</Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {selectedProject.githubUrl && (
                <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] hover:border-[var(--color-primary)]/30 transition-all"
                >
                  <Github size={16} /> View Source
                </a>
              )}
              {selectedProject.liveUrl && (
                <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm hover:bg-[var(--color-primary-dark)] transition-all"
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </SectionWrapper>
  );
}
