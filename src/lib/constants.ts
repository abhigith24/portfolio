export const NAV_ITEMS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Profile', href: '/admin/profile', icon: 'User' },
  { label: 'Projects', href: '/admin/projects', icon: 'FolderKanban' },
  { label: 'Skills', href: '/admin/skills', icon: 'Wrench' },
  { label: 'Experience', href: '/admin/experience', icon: 'Briefcase' },
  { label: 'Certifications', href: '/admin/certifications', icon: 'Award' },
  { label: 'Resumes', href: '/admin/resumes', icon: 'FileText' },
  { label: 'Social Links', href: '/admin/social', icon: 'Share2' },
  { label: 'Messages', href: '/admin/messages', icon: 'MessageSquare' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;

export const SOCIAL_PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: 'Github' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
  { value: 'twitter', label: 'Twitter / X', icon: 'Twitter' },
  { value: 'instagram', label: 'Instagram', icon: 'Instagram' },
  { value: 'youtube', label: 'YouTube', icon: 'Youtube' },
  { value: 'dribbble', label: 'Dribbble', icon: 'Dribbble' },
  { value: 'website', label: 'Website', icon: 'Globe' },
  { value: 'email', label: 'Email', icon: 'Mail' },
] as const;

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Languages',
  'Frameworks',
  'Other',
] as const;

export const PROJECT_CATEGORIES = [
  'Web App',
  'Mobile App',
  'Desktop App',
  'API',
  'Library',
  'CLI Tool',
  'Other',
] as const;

export const EXPERIENCE_TYPES = [
  { value: 'internship', label: 'Internship' },
  { value: 'training', label: 'Training' },
  { value: 'job', label: 'Job' },
] as const;

export const SUPABASE_BUCKETS = {
  PROFILE: 'profile',
  PROJECTS: 'projects',
  RESUMES: 'resumes',
  CERTIFICATIONS: 'certifications',
} as const;

export const DEFAULT_SEO = {
  siteTitle: 'Portfolio',
  siteDescription: 'A modern developer portfolio showcasing projects, skills, and experience.',
  siteUrl: '',
  ogImage: '',
  keywords: ['developer', 'portfolio', 'web developer', 'software engineer'],
  author: '',
  twitterHandle: '',
};

export const DEFAULT_ENABLED_SECTIONS = {
  hero: true,
  about: true,
  skills: true,
  projects: true,
  experience: true,
  certifications: true,
  resume: true,
  contact: true,
};
