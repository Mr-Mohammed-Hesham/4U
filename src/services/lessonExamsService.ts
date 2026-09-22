import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
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
  firestoreOk: boolean;
  serverOk: boolean;
  errorCode?: string;
  errorMessage?: string;
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
 * Read local cache for instant initial render while Firestore loads
 */
export function getStoredLessonExams(lessonKey: string): LessonExamItem[] {
  if (typeof window === 'undefined' || !lessonKey) return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const map = JSON.parse(raw);
    return Array.isArray(map[lessonKey]) ? map[lessonKey] : [];
  } catch (err) {
    console.warn('Error reading local cache:', err);
    return [];
  }
}

/**
 * Cache exams locally for offline resilience
 */
export function saveStoredLessonExams(lessonKey: string, exams: LessonExamItem[]): void {
  if (typeof window === 'undefined' || !lessonKey) return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[lessonKey] = exams;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('4u_lesson_exams_updated', { detail: { lessonKey, exams } }));
  } catch (err) {
    console.warn('Error saving local cache:', err);
  }
}

/**
 * Check if current Firestore security rules permit read/write to `lesson_exams`
 */
export async function checkFirestorePermissionStatus(): Promise<{
  allowed: boolean;
  code?: string;
  message?: string;
}> {
  if (!db) {
    return { allowed: false, message: 'Firebase DB client is not initialized' };
  }

  try {
    const pingRef = doc(db, 'lesson_exams', '_rules_check_ping');
    // Try a test write
    await setDoc(pingRef, { ping: true, checkedAt: new Date().toISOString() }, { merge: true });
    return { allowed: true };
  } catch (err: any) {
    const code = err?.code || 'unknown';
    const message = err?.message || String(err);
    return { allowed: false, code, message };
  }
}

/**
 * Sync exams to Server API (/api/lesson-exams) if running with node backend
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
  } catch {
    // Expected on static hosting (GitHub Pages)
  }
  return false;
}

/**
 * Write exam directly to Firestore in collection `lesson_exams`:
 * 1. Writes document to `lesson_exams/${exam.id}`
 * 2. Writes aggregate document to `lesson_exams/${sanitizeKey(lessonKey)}`
 */
async function writeExamToFirestore(exam: LessonExamItem, allExamsForLesson: LessonExamItem[]): Promise<{ ok: boolean; error?: any }> {
  if (!db) {
    return { ok: false, error: new Error('Firebase DB is not initialized') };
  }

  const docId = sanitizeKey(exam.lessonKey);
  const examDocRef = doc(db, 'lesson_exams', exam.id);
  const aggregateDocRef = doc(db, 'lesson_exams', docId);

  const cleanExamData = {
    id: exam.id,
    lessonKey: exam.lessonKey,
    title: exam.title,
    icon: exam.icon || '🎯',
    iconName: exam.iconName || exam.title,
    url: exam.url,
    description: exam.description || '',
    isOfficial: Boolean(exam.isOfficial),
    createdAt: exam.createdAt || new Date().toISOString(),
    createdBy: exam.createdBy || 'Admin',
    timestamp: Date.now()
  };

  try {
    // 1. Write individual exam document in collection 'lesson_exams'
    await setDoc(examDocRef, cleanExamData, { merge: true });

    // 2. Write aggregate document in collection 'lesson_exams'
    await setDoc(aggregateDocRef, {
      lessonKey: exam.lessonKey,
      exams: allExamsForLesson,
      updatedAt: new Date().toISOString(),
      count: allExamsForLesson.length,
      lastExamId: exam.id,
      lastExamTitle: exam.title
    }, { merge: true });

    return { ok: true };
  } catch (err: any) {
    console.warn('Firestore write notice for lesson_exams (cloud rules check):', err?.message || err);
    return { ok: false, error: err };
  }
}

/**
 * Delete exam from Firestore in collection `lesson_exams`
 */
async function deleteExamFromFirestore(lessonKey: string, examId: string, remainingExams: LessonExamItem[]): Promise<{ ok: boolean; error?: any }> {
  if (!db) return { ok: false };

  try {
    // 1. Delete individual exam document
    const examDocRef = doc(db, 'lesson_exams', examId);
    await deleteDoc(examDocRef).catch(() => {});

    // 2. Update aggregate document
    const docId = sanitizeKey(lessonKey);
    const aggregateDocRef = doc(db, 'lesson_exams', docId);
    await setDoc(aggregateDocRef, {
      lessonKey,
      exams: remainingExams,
      updatedAt: new Date().toISOString(),
      count: remainingExams.length
    }, { merge: true });

    return { ok: true };
  } catch (err: any) {
    console.warn('Firestore delete notice for lesson_exams (cloud rules check):', err?.message || err);
    return { ok: false, error: err };
  }
}

/**
 * Add a new custom exam for a lesson:
 * - Writes to Server API and local storage (guaranteed persistence)
 * - Writes directly to Firestore `lesson_exams` if cloud permissions permit
 */
export async function addLessonExam(exam: LessonExamItem): Promise<{ updated: LessonExamItem[]; status: SyncStatusResult }> {
  const current = getStoredLessonExams(exam.lessonKey);
  const updated = [...current.filter(item => item.id !== exam.id), exam];

  // 1. Cache locally immediately
  saveStoredLessonExams(exam.lessonKey, updated);

  // 2. Sync to Server API (persists on Node backend disk)
  const serverOk = await syncExamsToServer(exam.lessonKey, updated);

  // 3. Write to Firestore `lesson_exams`
  const firestoreRes = await writeExamToFirestore(exam, updated);

  if (firestoreRes.ok) {
    return {
      updated,
      status: {
        firestoreOk: true,
        serverOk,
        message: '🎉 تم حفظ الامتحان بنجاح في Firebase Firestore وسيظهر لجميع الطلاب!'
      }
    };
  }

  if (serverOk) {
    return {
      updated,
      status: {
        firestoreOk: false,
        serverOk: true,
        message: '🎉 تم حفظ الامتحان بنجاح في الخادم والذاكرة المحلية وسيظهر دائماً في هذا الدرس!'
      }
    };
  }

  // Handle fallback if offline
  const errCode = firestoreRes.error?.code || 'LOCAL_ONLY';
  const errMsg = firestoreRes.error?.message || 'Saved locally';

  return {
    updated,
    status: {
      firestoreOk: false,
      serverOk: false,
      errorCode: errCode,
      errorMessage: errMsg,
      message: '✅ تم حفظ الامتحان بنجاح في الذاكرة المحلية للجهاز!'
    }
  };
}

/**
 * Update an existing custom exam
 */
export async function updateLessonExam(
  lessonKey: string, 
  examId: string, 
  updates: Partial<Omit<LessonExamItem, 'id' | 'lessonKey'>>
): Promise<{ updated: LessonExamItem[]; status: SyncStatusResult }> {
  const current = getStoredLessonExams(lessonKey);
  let updatedExam: LessonExamItem | null = null;
  const updated = current.map(item => {
    if (item.id === examId) {
      updatedExam = { ...item, ...updates };
      return updatedExam;
    }
    return item;
  });

  if (!updatedExam) {
    return {
      updated,
      status: { firestoreOk: false, serverOk: false, message: 'الامتحان غير موجود' }
    };
  }

  // 1. Cache locally
  saveStoredLessonExams(lessonKey, updated);

  // 2. Sync to Server API
  const serverOk = await syncExamsToServer(lessonKey, updated);

  // 3. Sync to Firestore
  const firestoreRes = await writeExamToFirestore(updatedExam, updated);

  if (firestoreRes.ok) {
    return {
      updated,
      status: {
        firestoreOk: true,
        serverOk,
        message: '✅ تم حفظ التعديلات في Firebase Firestore بنجاح!'
      }
    };
  }

  if (serverOk) {
    return {
      updated,
      status: {
        firestoreOk: false,
        serverOk: true,
        message: '✅ تم حفظ التعديلات بنجاح في الخادم والذاكرة المحلية!'
      }
    };
  }

  return {
    updated,
    status: {
      firestoreOk: false,
      serverOk: false,
      errorCode: firestoreRes.error?.code || 'LOCAL_ONLY',
      message: '✅ تم تحديث الامتحان في الذاكرة المحلية للجهاز!'
    }
  };
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

  // 1. Delete from Server
  let serverOk = false;
  try {
    const res = await fetch(`/api/lesson-exams/${encodeURIComponent(lessonKey)}/${encodeURIComponent(examId)}`, {
      method: 'DELETE',
    });
    serverOk = res.ok;
  } catch {}

  // 2. Delete from Firestore
  const firestoreRes = await deleteExamFromFirestore(lessonKey, examId, updated);
  
  // 3. Save locally
  saveStoredLessonExams(lessonKey, updated);

  return {
    updated,
    status: {
      firestoreOk: firestoreRes.ok,
      serverOk,
      message: (firestoreRes.ok || serverOk) ? '🗑️ تم حذف الامتحان بنجاح.' : 'تم حذف الامتحان محلياً.'
    }
  };
}

/**
 * Fetch remote exams directly from Firestore `lesson_exams` collection
 * Supports both individual document queries and aggregate lesson document.
 */
export async function fetchRemoteLessonExams(lessonKey: string): Promise<LessonExamItem[]> {
  if (!lessonKey || !db) return getStoredLessonExams(lessonKey);

  const docId = sanitizeKey(lessonKey);
  const map = new Map<string, LessonExamItem>();

  try {
    // Strategy A: Read aggregate document in collection 'lesson_exams'
    const aggregateDocRef = doc(db, 'lesson_exams', docId);
    const aggregateSnap = await getDoc(aggregateDocRef);

    if (aggregateSnap.exists()) {
      const data = aggregateSnap.data();
      if (Array.isArray(data.exams)) {
        data.exams.forEach((e: LessonExamItem) => {
          if (e && e.id) map.set(e.id, e);
        });
      }
    }

    // Strategy B: Query individual documents in collection 'lesson_exams' where lessonKey == lessonKey
    try {
      const q = query(collection(db, 'lesson_exams'), where('lessonKey', '==', lessonKey));
      const querySnap = await getDocs(q);
      querySnap.forEach((docSnap) => {
        const item = docSnap.data() as LessonExamItem;
        if (item && item.id && item.title) {
          map.set(item.id, item);
        }
      });
    } catch (queryErr) {
      console.warn('Notice querying individual lesson_exams documents:', queryErr);
    }

    // If Firestore returned exams, update local storage and return them
    if (map.size > 0) {
      const exams = Array.from(map.values());
      saveStoredLessonExams(lessonKey, exams);
      return exams;
    }
  } catch (err: any) {
    console.warn('Firestore fetch remote exams notice:', err?.message || err);
  }

  // Fallback: If running on node server, try server API
  try {
    const res = await fetch(`/api/lesson-exams?lessonKey=${encodeURIComponent(lessonKey)}`, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.exams) && data.exams.length > 0) {
        data.exams.forEach((e: LessonExamItem) => map.set(e.id, e));
        const exams = Array.from(map.values());
        saveStoredLessonExams(lessonKey, exams);
        return exams;
      }
    }
  } catch {}

  return getStoredLessonExams(lessonKey);
}

/**
 * Subscribe to real-time updates for a lesson's exams directly from Firestore:
 * - Listens to aggregate doc: `lesson_exams/${docId}`
 * - Listens to collection query: `lesson_exams where lessonKey == lessonKey`
 * Any new exam added by Admin will instantly appear on all students' screens without refresh.
 */
export function subscribeToLessonExams(
  lessonKey: string, 
  callback: (exams: LessonExamItem[]) => void
): () => void {
  if (!lessonKey) return () => {};

  const unsubs: Unsubscribe[] = [];

  // Local window event listener
  const handleLocalUpdate = (e: any) => {
    if (e.detail?.lessonKey === lessonKey && Array.isArray(e.detail?.exams)) {
      callback(e.detail.exams);
    }
  };
  window.addEventListener('4u_lesson_exams_updated', handleLocalUpdate);

  if (db) {
    const docId = sanitizeKey(lessonKey);

    // 1. Real-time onSnapshot for aggregate document
    try {
      const aggregateRef = doc(db, 'lesson_exams', docId);
      const unsub1 = onSnapshot(aggregateRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.exams)) {
            callback(data.exams);
            saveStoredLessonExams(lessonKey, data.exams);
          }
        }
      }, (err) => {
        console.warn('Firestore onSnapshot aggregate notice:', err?.message || err);
      });
      unsubs.push(unsub1);
    } catch (err) {
      console.warn('Aggregate onSnapshot setup notice:', err);
    }

    // 2. Real-time onSnapshot for individual documents in collection 'lesson_exams'
    try {
      const q = query(collection(db, 'lesson_exams'), where('lessonKey', '==', lessonKey));
      const unsub2 = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items: LessonExamItem[] = [];
          snapshot.forEach((d) => {
            const val = d.data() as LessonExamItem;
            if (val && val.id && val.title) {
              items.push(val);
            }
          });
          if (items.length > 0) {
            callback(items);
            saveStoredLessonExams(lessonKey, items);
          }
        }
      }, (err) => {
        console.warn('Firestore onSnapshot query notice:', err?.message || err);
      });
      unsubs.push(unsub2);
    } catch (err) {
      console.warn('Query onSnapshot setup notice:', err);
    }
  }

  return () => {
    window.removeEventListener('4u_lesson_exams_updated', handleLocalUpdate);
    unsubs.forEach(unsub => {
      try { unsub(); } catch {}
    });
  };
}
