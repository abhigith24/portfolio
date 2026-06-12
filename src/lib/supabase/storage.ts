import { supabase } from './config';

/** Upload a file to a Supabase Storage bucket via the secure server-side API route */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  formData.append('path', path);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Upload failed: ${data.error}`);
  return data.url;
}

/** Delete a file from a Supabase Storage bucket */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/** Get the public URL for a file in a bucket */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** List files in a bucket folder */
export async function listFiles(
  bucket: string,
  folder?: string
): Promise<{ name: string; url: string }[]> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder || '', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) throw new Error(`List failed: ${error.message}`);

  return (data || []).map((file) => ({
    name: file.name,
    url: getPublicUrl(bucket, folder ? `${folder}/${file.name}` : file.name),
  }));
}

/** Extract the storage path from a full Supabase public URL */
export function extractPathFromUrl(url: string, bucket: string): string | null {
  try {
    const urlObj = new URL(url);
    const prefix = `/storage/v1/object/public/${bucket}/`;
    const idx = urlObj.pathname.indexOf(prefix);
    if (idx === -1) return null;
    return urlObj.pathname.substring(idx + prefix.length);
  } catch {
    return null;
  }
}
