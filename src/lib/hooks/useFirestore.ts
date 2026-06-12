'use client';

import { useEffect, useState } from 'react';
import { type DocumentData, type QueryConstraint } from 'firebase/firestore';
import { subscribeToCollection, subscribeToDocument } from '@/lib/firebase/firestore';

/** Hook for real-time collection subscription */
export function useCollection<T extends DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    try {
      const unsubscribe = subscribeToCollection<T>(
        collectionName,
        (items) => {
          if (active) {
            setData(items);
            setLoading(false);
          }
        },
        ...constraints
      );
      return () => {
        active = false;
        if (unsubscribe) unsubscribe();
      };
    } catch (err) {
      if (active) {
        setError(err as Error);
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}

/** Hook for real-time document subscription */
export function useDocument<T extends DocumentData>(
  collectionName: string,
  docId: string
) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) return;
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });

    try {
      const unsubscribe = subscribeToDocument<T>(
        collectionName,
        docId,
        (item) => {
          if (active) {
            setData(item);
            setLoading(false);
          }
        }
      );
      return () => {
        active = false;
        if (unsubscribe) unsubscribe();
      };
    } catch (err) {
      if (active) {
        setError(err as Error);
        setLoading(false);
      }
    }
  }, [collectionName, docId]);

  return { data, loading, error };
}
