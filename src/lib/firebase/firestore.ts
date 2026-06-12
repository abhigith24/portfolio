import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  increment,
  serverTimestamp,
  onSnapshot,
  type QueryConstraint,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';

/** Get a single document by ID */
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

/** Get multiple documents with optional query constraints */
export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
}

/** Add a new document */
export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing document */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a document */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

/** Increment the visitor counter atomically */
export async function incrementVisitorCount(): Promise<void> {
  const settingsRef = doc(db, 'settings', 'general');
  await updateDoc(settingsRef, {
    visitorCount: increment(1),
  });
}

/** Subscribe to real-time changes on a collection */
export function subscribeToCollection<T extends DocumentData>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  ...constraints: QueryConstraint[]
): Unsubscribe {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string });
    callback(data);
  });
}

/** Subscribe to real-time changes on a document */
export function subscribeToDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  callback: (data: (T & { id: string }) | null) => void
): Unsubscribe {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }
    callback({ id: docSnap.id, ...docSnap.data() } as T & { id: string });
  });
}

// Re-export commonly used Firestore utilities
export { orderBy, where, limit, serverTimestamp };
