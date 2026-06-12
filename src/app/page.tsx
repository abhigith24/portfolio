'use client';

import { useEffect, useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { getDocuments, getDocument } from '@/lib/firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/layout/BackToTop';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import CertificationSection from '@/components/sections/CertificationSection';
import ResumeSection from '@/components/sections/ResumeSection';
import ContactSection from '@/components/sections/ContactSection';
import { HeroSkeleton, SectionSkeleton } from '@/components/ui/Skeleton';
import type {
  UserProfile,
  Project,
  Skill,
  Experience,
  Certification,
  Resume,
  SocialLink,
  GeneralSettings,
} from '@/lib/types';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          profileData,
          projectsData,
          skillsData,
          experiencesData,
          certificationsData,
          resumesData,
          socialLinksData,
          settingsData,
        ] = await Promise.all([
          getDocument<UserProfile>('users', 'main'),
          getDocuments<Project>('projects', orderBy('order', 'asc')),
          getDocuments<Skill>('skills', orderBy('order', 'asc')),
          getDocuments<Experience>('experiences', orderBy('order', 'asc')),
          getDocuments<Certification>('certifications', orderBy('order', 'asc')),
          getDocuments<Resume>('resumes'),
          getDocuments<SocialLink>('socialLinks', orderBy('order', 'asc')),
          getDocument<GeneralSettings>('settings', 'general'),
        ]);

        setProfile(profileData);
        setProjects(projectsData);
        setSkills(skillsData);
        setExperiences(experiencesData);
        setCertifications(certificationsData);
        setResumes(resumesData);
        setSocialLinks(socialLinksData);
        setSettings(settingsData);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enabled = settings?.enabledSections || {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    certifications: true,
    resume: true,
    contact: true,
  };

  const defaultResume = resumes.find(r => r.isDefault) || resumes[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <HeroSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />

      {enabled.hero && (
        <HeroSection
          profile={profile}
          socialLinks={socialLinks}
          defaultResume={defaultResume}
          projectsCount={projects.length}
          skillsCount={skills.reduce((acc, skill) => {
            const names = skill.name.split(',').map(n => n.trim()).filter(Boolean);
            return acc + names.length;
          }, 0)}
          experiences={experiences}
        />
      )}

      {enabled.about && <AboutSection profile={profile} />}

      {enabled.skills && skills.length > 0 && <SkillsSection skills={skills} />}

      {enabled.projects && projects.length > 0 && <ProjectsSection projects={projects} />}

      {enabled.experience && experiences.length > 0 && <ExperienceSection experiences={experiences} />}

      {enabled.certifications && certifications.length > 0 && <CertificationSection certifications={certifications} />}

      {enabled.resume && resumes.length > 0 && <ResumeSection resumes={resumes} />}

      {enabled.contact && (
        <ContactSection
          socialLinks={socialLinks}
          contactInfo={settings?.contactInfo || null}
        />
      )}

      <Footer socialLinks={socialLinks} footerText={settings?.footerText} />
      <BackToTop />
    </main>
  );
}
