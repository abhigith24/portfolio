import { clsx, type ClassValue } from 'clsx';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

/** Merge class names with clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a Firestore Timestamp to a readable date string */
export function formatDate(timestamp: Timestamp | null | undefined, pattern = 'MMM yyyy'): string {
  if (!timestamp) return 'Present';
  return format(timestamp.toDate(), pattern);
}

/** Format a Firestore Timestamp to a full date string */
export function formatFullDate(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return '';
  return format(timestamp.toDate(), 'MMMM dd, yyyy');
}

/** Truncate text to a maximum length */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}

/** Generate a URL-friendly slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/** Delay execution */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Check if a URL is valid */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/** Get file extension from filename */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/** Format file size to human readable */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
