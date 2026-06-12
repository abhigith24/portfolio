'use client';

import { useEffect, useState } from 'react';
import { getDocument, incrementVisitorCount } from '@/lib/firebase/firestore';
import type { GeneralSettings } from '@/lib/types';

export function useVisitorCount() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Fetch current settings first to verify it exists
        const settings = await getDocument<GeneralSettings>('settings', 'general');
        if (settings) {
          const currentCount = settings.visitorCount || 0;
          setCount(currentCount);

          // Check if already counted this session
          const counted = sessionStorage.getItem('visitor_counted');
          if (!counted) {
            await incrementVisitorCount();
            sessionStorage.setItem('visitor_counted', 'true');
            setCount(currentCount + 1); // Optimistic UI update
          }
        }
      } catch (err) {
        console.error('Visitor count error:', err);
      }
    };

    trackVisit();
  }, []);

  return count;
}
