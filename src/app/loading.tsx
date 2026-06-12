import { HeroSkeleton, SectionSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <HeroSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
