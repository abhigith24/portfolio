import { Timestamp } from 'firebase/firestore';

// ─── User / Profile ────────────────────────────────────────
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  title: string;
  roles: string[];
  bio: string;
  careerObjective: string;
  phone: string;
  location: string;
  updatedAt: Timestamp;
}

// ─── Projects ───────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  images: string[];
  thumbnail: string;
  featured: boolean;
  order: number;
  category: string;
  status: 'completed' | 'in-progress';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Skills ─────────────────────────────────────────────────
export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
  order: number;
  createdAt: Timestamp;
}

// ─── Timeline / Milestones ──────────────────────────────────
export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt: Timestamp;
}

// ─── Experience ─────────────────────────────────────────────
export interface Experience {
  id: string;
  type: 'internship' | 'training' | 'job';
  title: string;
  company: string;
  location: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Certifications ─────────────────────────────────────────
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: Timestamp;
  expiryDate: Timestamp | null;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  order: number;
  createdAt: Timestamp;
}

// ─── Resumes ────────────────────────────────────────────────
export interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  isDefault: boolean;
  uploadedAt: Timestamp;
}

// ─── Social Links ───────────────────────────────────────────
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
  isVisible: boolean;
}

// ─── Contact Messages ───────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
}

// ─── Settings ───────────────────────────────────────────────
export interface SeoSettings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage: string;
  keywords: string[];
  author: string;
  twitterHandle: string;
}

export interface EnabledSections {
  hero: boolean;
  about: boolean;
  skills: boolean;
  projects: boolean;
  experience: boolean;
  certifications: boolean;
  resume: boolean;
  contact: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface GeneralSettings {
  visitorCount: number;
  enabledSections: EnabledSections;
  contactInfo: ContactInfo;
  footerText: string;
}

// ─── Component Props ────────────────────────────────────────
export interface SectionProps {
  id?: string;
  className?: string;
}
