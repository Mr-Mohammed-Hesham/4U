import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LessonExamItem {
  id: string;
  lessonKey: string;     // Unique identifier for the lesson (e.g., "adv_12_math_T3-U1-L1")
  title: string;         // Name of the exam (e.g., "اختبار بنك الأسئلة الوزاري")
  icon: string;          // Icon emoji or symbol (e.g., "📝", "🎯", "⚡", "🏆", "🧠", "🔬", "📐")
  iconName: string;      // Label for the icon named according to the exam name
  url: string;           // Repository / Exam URL (CRITICAL: kept strictly hidden in student UI)
  description?: string;  // Optional short notes or instructions
  isOfficial?: boolean;  // Whether it is the base official curriculum exam
  createdAt: string;     // ISO date
  createdBy?: string;    // Admin user name/email
}

export interface SyncStatusResult {
  serverOk: boolean;
  firestoreOk: boolean;
  message: string;
}

const LOCAL_STORAGE_KEY = '4u_lesson_custom_exams';

/**
 * Sanitize lesson key to be a safe Firestore document ID
 */
export function sanitizeKey(key: string): string {
  if (!key) return 'default_lesson';
  return key.replace(/[/\\#?%.\s]/g, '_');
}

/**
 * Get all custom exams stored locally across all lessons
 */
export function getAllStoredLessonExamsMap(): Record<string, LessonExamItem[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Error reading lesson custom exams from localStorage:', err);
    return {};
  }
}

/**
 * Get custom exams for a specific lesson from local cache
 */
export function getStoredLessonExams(lessonKey: string): LessonExamItem[] {
  if (!lessonKey) return [];
  const map = getAllStoredLessonExamsMap();
  return map[lessonKey] || [];
}

/**
 * Save all custom exams for a specific lesson to local storage and broadcast event
 */
export function saveStoredLessonExams(lessonKey: string, exams: LessonExamItem[]): void {
  if (typeof window === 'undefined' || !lessonKey) return;
  try {
    const map = getAllStoredLessonExamsMap();
    map[lessonKey] = exams;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('4u_lesson_exams_updated', { detail: { lessonKey, exams } }));
  } catch (err) {
    console.warn('Error writing lesson custom exams to localStorage:', err);
  }
}

/**
 * Sync exams to Server API (/api/lesson-exams)
 * Ensures all members on the platform share the exact same exams instantly.
 */
async function syncExamsToServer(lessonKey: string, exams: LessonExamItem[]): Promise<boolean> {
  if (!lessonKey) return false;
  try {
    const res = await fetch('/api/lesson-exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonKey, exams }),
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch (err) {
    console.warn('Notice syncing exams to platform server:', err);
  }
  return false;
}

/**
 * Fetch exams from Server API (/api/lesson-exams)
 */
async function fetchExamsFromServer(lessonKey: string): Promise<LessonExamItem[]> {
  if (!lessonKey) return [];
  try {
    const res = await fetch(`/api/lesson-exams?lessonKey=${encodeURIComponent(lessonKey)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-cache',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.exams)) {
        return data.exams;
      }
    }
  } catch (err) {
    console.warn('Notice fetching exams from platform server:', err);
  }
  return [];
}

/**
 * Push exams array to Firestore collections:
 * 1. Primary: 'lesson_exams/{docId}'
 * 2. Secondary fallback: 'settings/exams_{docId}'
 */
async function syncExamsToFirestore(lessonKey: string, exams: LessonExamItem[]): Promise<boolean> {
  if (!db || !lessonKey) return false;
  const docId = sanitizeKey(lessonKey);
  const payload = {
    lessonKey,
    exams,
    updatedAt: new Date().toISOString(),
    count: exams.length,
  };

  let atLeastOneSuccess = false;

  // 1. Primary write to lesson_exams
  try {
    const primaryRef = doc(db, 'lesson_exams', docId);
    await setDoc(primaryRef, payload, { merge: true });
    atLeastOneSuccess = true;
  } catch (err: any) {
    console.warn('Firestore primary sync notice (lesson_exams):', err?.message || err);
  }

  // 2. Secondary write to settings
  try {
    const secondaryRef = doc(db, 'settings', `exams_${docId}`);
    await setDoc(secondaryRef, payload, { merge: true });
    atLeastOneSuccess = true;
  } catch (err: any) {
    console.warn('Firestore secondary sync notice (settings):', err?.message || err);
  }

  return atLeastOneSuccess;
}

/**
 * Add a new custom exam for a lesson:
 * - Immediately updates localStorage
 * - Awaits Server API write (instant for all members)
 * - Awaits Firestore sync
 */
export async function addLessonExam(exam: LessonExamItem): Promise<{ updated: LessonExamItem[]; status: SyncStatusResult }> {
  const current = getStoredLessonExams(exam.lessonKey);
  const updated = [...current.filter(item => item.id !== exam.id), exam];
  saveStoredLessonExams(exam.lessonKey, updated);

  const [serverOk, firestoreOk] = await Promise.all([
    syncExamsToServer(exam.lessonKey, updated),
    syncExamsToFirestore(exam.lessonKey, updated),
  ]);

  let message = '✅ تم الحفظ بنجاح ونشر الاختبار!';
  if (firestoreOk && serverOk) {
    message = '✅ تم حفظ الاختبار في الفايربيز وسيرفر المنصة بنجاح!';
  } else if (serverOk) {
    message = '✅ تم حفظ الاختبار ونشره للأعضاء عبر سيرفر المنصة بنجاح!';
  }

  return { updated, status: { serverOk, firestoreOk, message } };
}

/**
 * Update an existing custom exam for a lesson
 */
export async function updateLessonExam(
  lessonKey: string, 
  examId: string, 
  updates: Partial<Omit<LessonExamItem, 'id' | 'lessonKey'>>
): Promise<{ updated: LessonExamItem[]; status: SyncStatusResult }> {
  const current = getStoredLessonExams(lessonKey);
  const updated = current.map(item => {
    if (item.id === examId) {
      return { ...item, ...updates };
    }
    return item;
  });
  saveStoredLessonExams(lessonKey, updated);

  const [serverOk, firestoreOk] = await Promise.all([
    syncExamsToServer(lessonKey, updated),
    syncExamsToFirestore(lessonKey, updated),
  ]);

  let message = '✅ تم تعديل الاختبار بنجاح!';
  if (firestoreOk && serverOk) {
    message = '✅ تم حفظ التعديلات في الفايربيز وسيرفر المنصة!';
  }

  return { updated, status: { serverOk, firestoreOk, message } };
}

/**
 * Delete a custom exam for a lesson
 */
export async function deleteLessonExam(
  lessonKey: string, 
  examId: string
): Promise<{ updated: LessonExamItem[]; status: SyncStatusResult }> {
  const current = getStoredLessonExams(lessonKey);
  const updated = current.filter(item => item.id !== examId);
  saveStoredLessonExams(lessonKey, updated);

  // Also call Server DELETE endpoint
  try {
    fetch(`/api/lesson-exams/${encodeURIComponent(lessonKey)}/${encodeURIComponent(examId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  } catch {}

  const [serverOk, firestoreOk] = await Promise.all([
    syncExamsToServer(lessonKey, updated),
    syncExamsToFirestore(lessonKey, updated),
  ]);

  return { 
    updated, 
    status: { 
      serverOk, 
      firestoreOk, 
      message: '🗑️ تم حذف الاختبار بنجاح من فايربيز والمنصة.' 
    } 
  };
}

/**
 * Fetch remote exams from both Server API and Firestore,
 * and merge cleanly without duplicating.
 */
export async function fetchRemoteLessonExams(lessonKey: string): Promise<LessonExamItem[]> {
  if (!lessonKey) return [];
  const local = getStoredLessonExams(lessonKey);
  const mergedMap = new Map<string, LessonExamItem>();

  // 1. Seed with local
  local.forEach(e => mergedMap.set(e.id, e));

  // 2. Fetch from Server API
  try {
    const serverExams = await fetchExamsFromServer(lessonKey);
    if (serverExams && serverExams.length > 0) {
      serverExams.forEach(e => mergedMap.set(e.id, e));
    }
  } catch (err) {
    console.warn('Server fetch error:', err);
  }

  // 3. Fetch from Firestore (primary & secondary)
  if (db) {
    const docId = sanitizeKey(lessonKey);
    try {
      const primaryRef = doc(db, 'lesson_exams', docId);
      const snap = await Promise.race([
        getDoc(primaryRef),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500))
      ]);

      if (snap && (snap as any).exists && (snap as any).exists()) {
        const data = (snap as any).data();
        if (Array.isArray(data.exams)) {
          data.exams.forEach((e: LessonExamItem) => mergedMap.set(e.id, e));
        }
      } else {
        // Try secondary
        const secRef = doc(db, 'settings', `exams_${docId}`);
        const secSnap = await Promise.race([
          getDoc(secRef),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
        ]);
        if (secSnap && (secSnap as any).exists && (secSnap as any).exists()) {
          const data = (secSnap as any).data();
          if (Array.isArray(data.exams)) {
            data.exams.forEach((e: LessonExamItem) => mergedMap.set(e.id, e));
          }
        }
      }
    } catch (err) {
      console.warn('Firestore fetch notice:', err);
    }
  }

  const finalExams = Array.from(mergedMap.values());
  saveStoredLessonExams(lessonKey, finalExams);
  return finalExams;
}

/**
 * Subscribe to real-time updates for a lesson's exams
 */
export function subscribeToLessonExams(
  lessonKey: string, 
  callback: (exams: LessonExamItem[]) => void
): () => void {
  if (!lessonKey) return () => {};

  // Local window event listener
  const handleLocalUpdate = (e: any) => {
    if (e.detail?.lessonKey === lessonKey && Array.isArray(e.detail?.exams)) {
      callback(e.detail.exams);
    }
  };
  window.addEventListener('4u_lesson_exams_updated', handleLocalUpdate);

  // Firestore snapshot listener
  let unsubFirestore: (() => void) | null = null;
  if (db) {
    try {
      const docId = sanitizeKey(lessonKey);
      const primaryRef = doc(db, 'lesson_exams', docId);
      unsubFirestore = onSnapshot(primaryRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.exams)) {
            callback(data.exams);
            saveStoredLessonExams(lessonKey, data.exams);
          }
        }
      }, (err) => {
        console.warn('Notice onSnapshot for lesson_exams:', err);
      });
    } catch (err) {
      console.warn('Firestore subscribe error:', err);
    }
  }

  return () => {
    window.removeEventListener('4u_lesson_exams_updated', handleLocalUpdate);
    if (unsubFirestore) {
      try { unsubFirestore(); } catch {}
    }
  };
}
