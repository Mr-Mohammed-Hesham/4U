import {
  Eot2026Curriculum,
  Eot2026GradeId,
  Eot2026StreamId,
  Eot2026SubjectId,
  Eot2026TermId,
  EotLanguage,
  EotQuestionProbeResult,
  EotStudentProgressStore,
} from './types';

const PRIMARY_CLOUD_RUN_BACKEND =
  'https://ais-pre-zkin4elv7zwqu2e6fa3gzm-684462415759.europe-west2.run.app';

const PROGRESS_STORAGE_KEY = 'mmh_eot_structures_progress_v1';
const CURRICULA_CACHE_KEY = '4u_eot2026_curricula_cache_v1';
const QUESTION_COUNTS_KEY = '4u_eot2026_question_counts_v1';

export const EOT2026_TERMS: { id: Eot2026TermId; labelAr: string; labelEn: string }[] = [
  { id: 'T1', labelAr: 'الفصل الدراسي الأول', labelEn: 'Term 1 (EOT 1)' },
  { id: 'T2', labelAr: 'الفصل الدراسي الثاني', labelEn: 'Term 2 (EOT 2)' },
  { id: 'T3', labelAr: 'الفصل الدراسي الثالث', labelEn: 'Term 3 (EOT 3)' },
];

export const EOT2026_GRADES: { id: Eot2026GradeId; labelAr: string; labelEn: string }[] = [
  { id: '12', labelAr: 'الصف الثاني عشر (12)', labelEn: 'Grade 12' },
  { id: '11', labelAr: 'الصف الحادي عشر (11)', labelEn: 'Grade 11' },
  { id: '10', labelAr: 'الصف العاشر (10)', labelEn: 'Grade 10' },
];

export const EOT2026_STREAMS: { id: Eot2026StreamId; labelAr: string; labelEn: string }[] = [
  { id: 'adv_bridge', labelAr: 'متقدم · بريدج', labelEn: 'Advanced · Bridge' },
  { id: 'adv_inspire', labelAr: 'متقدم · انسباير', labelEn: 'Advanced · Inspire' },
  { id: 'general', labelAr: 'المسار العام', labelEn: 'General Stream' },
];

export const EOT2026_SUBJECTS: { id: Eot2026SubjectId; labelAr: string; labelEn: string }[] = [
  { id: 'physics', labelAr: 'الفيزياء', labelEn: 'Physics' },
  { id: 'math', labelAr: 'الرياضيات', labelEn: 'Mathematics' },
];


const INITIAL_T1_BASE: Eot2026Curriculum[] = [
  {
    id: '12-adv-bri-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'adv_bridge',
    subject: 'physics',
    titleAr: 'فيزياء 12 متقدم — بريدج',
    titleEn: 'Grade 12 Advanced Physics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · مقسم صفحة لكل سؤال وزاري مع الحل والتدريب التفاعلي',
    subtitleEn: 'Term 1 EOT Exam Structure · Dedicated interactive page per exam question',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
    knownQuestionTitles: {
      1: { ar: 'الكهرباء الساكنة والشحنات الكهربائية — المراجعة التأسيسية', en: 'Electrostatics & Electric Charges — Core Review' },
      2: { ar: 'القسم 1.2: الشحنات الكهربائية وقانون حفظ الشحنة', en: 'Section 1.2: Electric Charges & Conservation' },
      3: { ar: 'الموصلات والعوازل والموصلات الفائقة', en: 'Conductors, Insulators & Superconductors' },
      4: { ar: 'الشحن الكهربائي وتطبيقات الكشاف الكهربائي', en: 'Charging Processes & Electroscope Applications' },
      5: { ar: 'القوة الكهروستاتيكية داخل الذرة وقانون كولوم', en: 'Electrostatic Force Inside the Atom & Coulomb’s Law' },
      6: { ar: 'خطوط المجال الكهربائي وتمثيل الشحنات', en: 'Electric Field Lines & Charge Configurations' },
      7: { ar: 'التوزيعات المتصلة للشحنات الكهربائية', en: 'Continuous Charge Distributions' },
      8: { ar: 'التدفق الكهربائي وقانون جاوس — الجزء الأول', en: 'Electric Flux & Gauss’s Law — Part 1' },
      9: { ar: 'التدفق الكهربائي وقانون جاوس — تطبيقات السؤال التاسع', en: 'Electric Flux & Gauss’s Law — Question 9 Applications' },
    },
  },
  {
    id: '12-adv-bri-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'adv_bridge',
    subject: 'math',
    titleAr: 'رياضيات 12 متقدم — بريدج',
    titleEn: 'Grade 12 Advanced Mathematics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · النهايات والاتصال والتفاضل مقسم حسب رقم السؤال',
    subtitleEn: 'Term 1 EOT Exam Structure · Limits, Continuity & Derivatives per question page',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '12-adv-ins-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'adv_inspire',
    subject: 'physics',
    titleAr: 'فيزياء 12 متقدم — انسباير',
    titleEn: 'Grade 12 Advanced Physics — Inspire',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول لمنهج انسباير المتقدم · صفحة مستقلة لكل سؤال',
    subtitleEn: 'Term 1 EOT Exam Structure for Inspire Advanced Physics · Page per question',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '12-gen-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '12',
    stream: 'general',
    subject: 'math',
    titleAr: 'رياضيات 12 عام',
    titleEn: 'Grade 12 General Mathematics',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للمسار العام · تدريبات شاملة لكل سؤال في صفحة منفصلة',
    subtitleEn: 'Term 1 EOT Exam Structure for General Stream · Dedicated page per question',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '11-adv-bri-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '11',
    stream: 'adv_bridge',
    subject: 'math',
    titleAr: 'رياضيات 11 متقدم — بريدج',
    titleEn: 'Grade 11 Advanced Mathematics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · مراجعة مركزة وتدريب تفاعلي لكل سؤال وزاري',
    subtitleEn: 'Term 1 EOT Exam Structure · Focused practice page for every exam question',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '11-adv-bri-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '11',
    stream: 'adv_bridge',
    subject: 'physics',
    titleAr: 'فيزياء 11 متقدم — بريدج',
    titleEn: 'Grade 11 Advanced Physics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول · المتجهات والميكانيكا مقسمة صفحة لكل سؤال',
    subtitleEn: 'Term 1 EOT Exam Structure · Vectors & Mechanics structured per question page',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '11-gen-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '11',
    stream: 'general',
    subject: 'math',
    titleAr: 'رياضيات 11 عام',
    titleEn: 'Grade 11 General Mathematics',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للمسار العام · تصفح مباشر لصفحات الأسئلة بالترتيب',
    subtitleEn: 'Term 1 EOT Exam Structure for General Stream · Sequential question pages',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '10-gen-math-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '10',
    stream: 'general',
    subject: 'math',
    titleAr: 'رياضيات 10 عام',
    titleEn: 'Grade 10 General Mathematics',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للصف العاشر العام · صفحة مخصصة لكل سؤال',
    subtitleEn: 'Term 1 EOT Exam Structure for Grade 10 General · Dedicated page per question',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: '10-adv-bri-phy-t1-2026',
    year: '2026',
    term: 'T1',
    grade: '10',
    stream: 'adv_bridge',
    subject: 'physics',
    titleAr: 'فيزياء 10 متقدم — بريدج',
    titleEn: 'Grade 10 Advanced Physics — Bridge',
    subtitleAr: 'هيكل امتحان نهاية الفصل الأول للصف العاشر المتقدم بريدج · كل سؤال في صفحة تفاعلية',
    subtitleEn: 'Term 1 EOT Exam Structure for Grade 10 Advanced Bridge · Interactive page per question',
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
];

function expandDefaultCurricula(baseList: Eot2026Curriculum[] = INITIAL_T1_BASE): Eot2026Curriculum[] {
  const result: Eot2026Curriculum[] = [];
  for (const termObj of EOT2026_TERMS) {
    for (const base of baseList) {
      if (base.term === termObj.id) {
        if (!result.some((r) => r.id === base.id)) result.push(base);
        continue;
      }
      if (base.term !== 'T1') continue;
      const id = base.id.replace('-t1-2026', `-${termObj.id.toLowerCase()}-2026`);
      if (result.some((r) => r.id === id)) continue;
      const termNameAr = termObj.id === 'T2' ? 'الفصل الثاني' : 'الفصل الثالث';
      const termNameEn = termObj.id === 'T2' ? 'Term 2' : 'Term 3';
      result.push({
        ...base,
        id,
        term: termObj.id,
        subtitleAr: `هيكل امتحان نهاية ${termNameAr} 2026 · مقسم صفحة لكل سؤال وزاري`,
        subtitleEn: `${termNameEn} 2026 EOT Exam Structure · Dedicated interactive page per question`,
        knownQuestionTitles: undefined,
      });
    }
  }
  return result;
}

export function getInitialEot2026Curricula(): Eot2026Curriculum[] {
  if (typeof window !== 'undefined') {
    try {
      const cached = window.localStorage.getItem(CURRICULA_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return expandDefaultCurricula();
}

export function loadEot2026Progress(): EotStudentProgressStore {
  const fallback: EotStudentProgressStore = { completed: {}, bookmarked: {}, notes: {} };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      completed: parsed.completed || {},
      bookmarked: parsed.bookmarked || {},
      notes: parsed.notes || {},
      lastVisited: parsed.lastVisited,
    };
  } catch {
    return fallback;
  }
}

export function saveEot2026Progress(store: EotStudentProgressStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function loadLocalQuestionCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(QUESTION_COUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalQuestionCounts(counts: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(QUESTION_COUNTS_KEY, JSON.stringify(counts));
  } catch {}
}

async function fetchJsonWithFallback(
  pathSuffix: string,
  init?: RequestInit,
  timeoutMs = 7000
): Promise<any | null> {
  const bases = [''];
  if (
    typeof window !== 'undefined' &&
    !window.location.origin.includes('ais-pre-zkin4elv7zwqu2e6fa3gzm')
  ) {
    bases.push(PRIMARY_CLOUD_RUN_BACKEND);
  }

  for (const base of bases) {
    try {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(`${base}${pathSuffix}`, {
        ...init,
        signal: ctrl.signal,
      });
      window.clearTimeout(timer);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
  }
  return null;
}

const clientQuestionHtmlCache = new Map<string, EotQuestionProbeResult>();

export async function syncLiveEot2026Curricula(forceRefresh = false): Promise<{
  curricula: Eot2026Curriculum[];
  sharedCounts: Record<string, number>;
}> {
  const qs = forceRefresh ? '?refresh=true' : '';
  const data = await fetchJsonWithFallback(`/api/external-banks/eot2026${qs}`, undefined, 7500);
  if (data && data.success && Array.isArray(data.curricula) && data.curricula.length > 0) {
    try {
      window.localStorage.setItem(CURRICULA_CACHE_KEY, JSON.stringify(data.curricula));
    } catch {}
    return {
      curricula: data.curricula,
      sharedCounts: data.sharedSettings?.totalQuestionsByCurriculum || {},
    };
  }
  return {
    curricula: getInitialEot2026Curricula(),
    sharedCounts: loadLocalQuestionCounts(),
  };
}

export async function probeLiveEot2026Batch(
  curriculumIds: string[],
  maxQuestions = 25,
  forceRefresh = false
): Promise<Record<string, Record<number, EotQuestionProbeResult>>> {
  const data = await fetchJsonWithFallback(
    '/api/external-banks/eot2026/probe-batch',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curriculumIds, maxQuestions, forceRefresh }),
    },
    10000
  );

  if (data && data.success && data.probes) {
    return data.probes;
  }

  return {};
}

export async function fetchLiveEot2026QuestionPage(
  curriculumId: string,
  q: number,
  forceRefresh = false
): Promise<EotQuestionProbeResult> {
  const cacheKey = `${curriculumId}__Q${q}`;
  if (!forceRefresh) {
    const cached = clientQuestionHtmlCache.get(cacheKey);
    if (cached && cached.html && cached.checkedAt && Date.now() - cached.checkedAt < 120000) {
      return cached;
    }
  }

  const qs = `?curriculumId=${encodeURIComponent(curriculumId)}&q=${q}${
    forceRefresh ? '&refresh=true' : ''
  }`;
  const data = await fetchJsonWithFallback(`/api/external-banks/eot2026/question${qs}`, undefined, 8000);

  if (data && data.success) {
    const result: EotQuestionProbeResult = {
      status: data.status === 'live' ? 'live' : 'pending',
      liveTitle: data.liveTitle,
      html: data.html || '',
      checkedAt: data.checkedAt || Date.now(),
    };
    if (result.status === 'live' && result.html) {
      clientQuestionHtmlCache.set(cacheKey, result);
    }
    return result;
  }

  return { status: 'pending', checkedAt: Date.now() };
}

export async function updateSharedEot2026QuestionCount(
  curriculumId: string,
  totalQuestions: number
): Promise<void> {
  const current = loadLocalQuestionCounts();
  current[curriculumId] = totalQuestions;
  saveLocalQuestionCounts(current);

  await fetchJsonWithFallback(
    '/api/external-banks/eot2026/shared-settings',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curriculumId, totalQuestions }),
    },
    5000
  );
}

export function getTermLabel2026(term: Eot2026TermId, lang: EotLanguage): string {
  const item = EOT2026_TERMS.find((t) => t.id === term);
  if (!item) return term;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function getGradeLabel2026(grade: Eot2026GradeId, lang: EotLanguage): string {
  const item = EOT2026_GRADES.find((g) => g.id === grade);
  if (!item) return lang === 'ar' ? `الصف ${grade}` : `Grade ${grade}`;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function getStreamLabel2026(stream: Eot2026StreamId, lang: EotLanguage): string {
  const item = EOT2026_STREAMS.find((s) => s.id === stream);
  if (!item) return stream;
  return lang === 'ar' ? item.labelAr : item.labelEn;
}

export function getSubjectLabel2026(subject: Eot2026SubjectId, lang: EotLanguage): string {
  const item = EOT2026_SUBJECTS.find((s) => s.id === subject);
  if (item) return lang === 'ar' ? item.labelAr : item.labelEn;
  if (subject === 'chemistry') return lang === 'ar' ? 'الكيمياء' : 'Chemistry';
  if (subject === 'biology') return lang === 'ar' ? 'الأحياء' : 'Biology';
  return subject;
}
