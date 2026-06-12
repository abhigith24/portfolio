'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { uploadFile } from '@/lib/supabase/storage';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  bucket: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export default function ImageUploader({
  bucket,
  currentUrl,
  onUpload,
  folder = '',
  accept = 'image/*',
  label = 'Upload Image',
  className,
  aspectRatio = 'aspect-video',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const path = folder
        ? `${folder}/${Date.now()}-${file.name}`
        : `${Date.now()}-${file.name}`;
      const url = await uploadFile(bucket, path, file);
      onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</p>}

      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden cursor-pointer hover:border-[var(--color-primary)]/40 transition-all',
          aspectRatio
        )}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Upload preview" fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Click to change</p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
            {uploading ? (
              <div className="animate-spin h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload size={24} className="mb-2" />
                <p className="text-sm">Click to upload</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
