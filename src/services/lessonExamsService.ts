import { doc, setDoc, getDoc } from 'firebase/firestore';
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

const LOCAL_STORAGE_KEY = '4u_lesson_custom_exams';

/**
 * Sanitize lesson key to be a safe Firestore document ID
 */
function sanitizeKey(key: string): string {
  return key.replace(/[/\\#?%]/g, '_');
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
    window.dispatchEvent(new CustomEvent('4u_lesson_exams_updated', { detail: { lessonKey } }));
  } catch (err) {
    console.warn('Error writing lesson custom exams to localStorage:', err);
  }
}

/**
 * Add a new custom exam for a lesson (with immediate local save and background Firestore sync)
 */
export async function addLessonExam(exam: LessonExamItem): Promise<LessonExamItem[]> {
  const current = getStoredLessonExams(exam.lessonKey);
  const updated = [...current, exam];
  saveStoredLessonExams(exam.lessonKey, updated);

  // Background Firestore sync
  syncExamsToFirestore(exam.lessonKey, updated).catch(err => {
    console.warn('Notice syncing exam to Firestore:', err);
  });

  return updated;
}

/**
 * Update an existing custom exam for a lesson
 */
export async function updateLessonExam(
  lessonKey: string, 
  examId: string, 
  updates: Partial<Omit<LessonExamItem, 'id' | 'lessonKey'>>
): Promise<LessonExamItem[]> {
  const current = getStoredLessonExams(lessonKey);
  const updated = current.map(item => {
    if (item.id === examId) {
      return { ...item, ...updates };
    }
    return item;
  });
  saveStoredLessonExams(lessonKey, updated);

  syncExamsToFirestore(lessonKey, updated).catch(err => {
    console.warn('Notice syncing exam update to Firestore:', err);
  });

  return updated;
}

/**
 * Delete a custom exam for a lesson
 */
export async function deleteLessonExam(lessonKey: string, examId: string): Promise<LessonExamItem[]> {
  const current = getStoredLessonExams(lessonKey);
  const updated = current.filter(item => item.id !== examId);
  saveStoredLessonExams(lessonKey, updated);

  syncExamsToFirestore(lessonKey, updated).catch(err => {
    console.warn('Notice syncing exam deletion to Firestore:', err);
  });

  return updated;
}

/**
 * Push exams array to Firestore collection 'lesson_exams'
 */
async function syncExamsToFirestore(lessonKey: string, exams: LessonExamItem[]): Promise<void> {
  if (!db || !lessonKey) return;
  try {
    const docId = sanitizeKey(lessonKey);
    const docRef = doc(db, 'lesson_exams', docId);
    await setDoc(docRef, {
      lessonKey,
      exams,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore sync notice for lesson exams:', err);
  }
}

/**
 * Fetch remote exams from Firestore and merge with local storage
 */
export async function fetchRemoteLessonExams(lessonKey: string): Promise<LessonExamItem[]> {
  if (!lessonKey) return [];
  const local = getStoredLessonExams(lessonKey);
  
  if (!db) return local;

  try {
    const docId = sanitizeKey(lessonKey);
    const docRef = doc(db, 'lesson_exams', docId);
    
    // Timeout of 3 seconds to avoid blocking slow connections
    const docSnap = await Promise.race([
      getDoc(docRef),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
    ]);

    if (docSnap && (docSnap as any).exists && (docSnap as any).exists()) {
      const data = (docSnap as any).data();
      if (Array.isArray(data.exams)) {
        // Merge without duplicating IDs
        const remoteExams: LessonExamItem[] = data.exams;
        const mergedMap = new Map<string, LessonExamItem>();
        
        local.forEach(e => mergedMap.set(e.id, e));
        remoteExams.forEach(e => mergedMap.set(e.id, e));
        
        const merged = Array.from(mergedMap.values());
        saveStoredLessonExams(lessonKey, merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn('Notice loading remote lesson exams:', err);
  }

  return local;
}
