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

const PROGRESS_STORAGE_KEY = 'mmh_eot_structures_progress_v1';
const CURRICULA_CACHE_KEY = '4u_eot2026_curricula_cache_v2';
const QUESTION_COUNTS_KEY = '4u_eot2026_question_counts_v1';
const QUESTION_TITLES_CACHE_KEY = '4u_eot2026_titles_cache_v2';
const REPO_INDEX_CACHE_KEY = '4u_eot2026_repo_index_v2';

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

// Runtime origin builders (avoid exposing plain literal repo URLs in UI state or DOM)
const OWNER_ACCOUNT = ['Mr', 'Mohammed', 'Hesham'].join('-');
const OWNER_LOWER = OWNER_ACCOUNT.toLowerCase();
const RAW_HOST = ['https://raw', 'githubusercontent', 'com'].join('.');
const API_HOST = ['https://api', 'github', 'com'].join('.');
const PAGES_HOST = `https://${OWNER_LOWER}.${['github', 'io'].join('.')}`;

function hasSameOriginBackend(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.run.app');
}

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

// Internal slug templates per curriculum ID (never exposed to UI)
const customSlugTemplates = new Map<string, string[]>();

function buildCandidateSlugsForCurriculum(c: Eot2026Curriculum, q: number): string[] {
  const qStr = String(q);
  const custom = customSlugTemplates.get(c.id);
  const slugs: string[] = [];

  if (custom && custom.length > 0) {
    for (const tpl of custom) {
      slugs.push(tpl.replace('{q}', qStr));
    }
  }

  const streamCodes =
    c.stream === 'adv_bridge'
      ? ['Adv-Bri']
      : c.stream === 'adv_inspire'
      ? ['Adv-Ins', 'Adv-Rev']
      : ['Jen', 'Gen'];

  const subCodes =
    c.subject === 'physics'
      ? ['phy', 'Phy']
      : c.subject === 'math'
      ? ['math', 'Math']
      : c.subject === 'chemistry'
      ? ['chem', 'Chem']
      : ['bio', 'Bio'];

  const seps = ['-Q', '.Q'];

  for (const st of streamCodes) {
    for (const sb of subCodes) {
      for (const sp of seps) {
        slugs.push(`${c.grade}${st}-${sb}-${c.term}-${c.year}-EOT${sp}${qStr}`);
      }
    }
  }

  return Array.from(new Set<string>(slugs));
}

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

      const baseSlugs = customSlugTemplates.get(base.id);
      if (baseSlugs && baseSlugs.length > 0) {
        customSlugTemplates.set(
          id,
          baseSlugs.map((s) => s.replace(/-T1-2026-/gi, `-${termObj.id}-2026-`))
        );
      }

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

function loadCachedTitles(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(QUESTION_TITLES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCachedTitles(titles: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(QUESTION_TITLES_CACHE_KEY, JSON.stringify(titles));
  } catch {}
}

function parseTsArraySafe(code: string, variableName: string): any[] {
  try {
    const startIdx = code.indexOf(variableName);
    if (startIdx === -1) return [];
    const eqIdx = code.indexOf('=', startIdx);
    const arrStart = code.indexOf('[', eqIdx);
    if (arrStart === -1) return [];

    let depth = 0;
    let arrEnd = -1;
    let inString = false;
    let stringChar = '';
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = arrStart; i < code.length; i++) {
      const ch = code[i];
      const next = code[i + 1];
      const prev = code[i - 1];

      if (inLineComment) {
        if (ch === '\n') inLineComment = false;
        continue;
      }
      if (inBlockComment) {
        if (ch === '*' && next === '/') {
          inBlockComment = false;
          i++;
        }
        continue;
      }
      if (inString) {
        if (ch === stringChar && prev !== '\\') inString = false;
      } else {
        if (ch === '/' && next === '/') {
          inLineComment = true;
          i++;
          continue;
        }
        if (ch === '/' && next === '*') {
          inBlockComment = true;
          i++;
          continue;
        }
        if (ch === '"' || ch === "'" || ch === '`') {
          inString = true;
          stringChar = ch;
        } else if (ch === '[') depth++;
        else if (ch === ']') {
          depth--;
          if (depth === 0) {
            arrEnd = i + 1;
            break;
          }
        }
      }
    }

    if (arrEnd !== -1) {
      const arrCode = code.substring(arrStart, arrEnd);
      const parsed = new Function('return ' + arrCode)();
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function cleanQuestionTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*\|\s*Mr\.?\s*Mohammed\s*Hesham.*$/i, '')
    .replace(/^[\p{Extended_Pictographic}\uFE0F\u200D⚡⚛️📐📚🎯🏆🔥✨📊\s]+/u, '')
    .trim();
}

function prepareSafeSrcDocHtml(rawHtml: string): string {
  let html = rawHtml
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, '');

  const protectionScript = `<script>
(function(){
  try {
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
      }
    });
    window.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  } catch(e) {}
})();
</script>`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${protectionScript}</head>`);
  } else {
    html = `${protectionScript}${html}`;
  }
  return html;
}

interface DiscoveredRepoEntry {
  name: string;
  branch: string;
  hasPages: boolean;
  size: number;
}

let inMemoryRepoIndex: { entries: DiscoveredRepoEntry[]; timestamp: number } | null = null;
let inMemoryCurriculaList: Eot2026Curriculum[] = getInitialEot2026Curricula();
const clientQuestionHtmlCache = new Map<string, EotQuestionProbeResult>();

function extractSlugFromTemplate(urlOrSlug: string): string {
  return urlOrSlug
    .replace(/^https?:\/\/[^/]+\//i, '')
    .replace(/\/+$/, '')
    .trim();
}

export function parseEot2026RepoName(repoName: string): {
  grade: string;
  stream: Eot2026StreamId;
  subject: Eot2026SubjectId;
  subShort: string;
  term: Eot2026TermId;
  year: string;
  q: number;
} | null {
  const m = repoName.match(
    /^(\d+)(Adv-Bri|Adv-Ins|Adv-Rev|Jen|Gen)-([a-zA-Z]+)-(?:(T[123])-(2026)|(2026)-(T[123]))-EOT[-._]?Q(\d+)$/i
  );
  if (!m) return null;
  const grade = m[1];
  const streamRaw = m[2].toLowerCase();
  const subRaw = m[3].toLowerCase();
  const term = ((m[4] || m[7] || 'T1').toUpperCase() as Eot2026TermId);
  const year = m[5] || m[6] || '2026';
  const q = Number(m[8]) || 1;

  const stream: Eot2026StreamId =
    streamRaw === 'adv-bri'
      ? 'adv_bridge'
      : streamRaw === 'adv-ins' || streamRaw === 'adv-rev'
      ? 'adv_inspire'
      : 'general';

  const subject: Eot2026SubjectId =
    subRaw.startsWith('phy')
      ? 'physics'
      : subRaw.startsWith('math')
      ? 'math'
      : subRaw.startsWith('chem')
      ? 'chemistry'
      : 'biology';

  const subShort =
    subject === 'physics'
      ? 'phy'
      : subject === 'math'
      ? 'math'
      : subject === 'chemistry'
      ? 'chem'
      : 'bio';

  return { grade, stream, subject, subShort, term, year, q };
}

async function fetchRepoIndexDirect(forceRefresh = false): Promise<DiscoveredRepoEntry[] | null> {
  const now = Date.now();
  if (!forceRefresh && inMemoryRepoIndex && now - inMemoryRepoIndex.timestamp < 60000) {
    return inMemoryRepoIndex.entries;
  }

  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(REPO_INDEX_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.entries) && now - (parsed.timestamp || 0) < 60000) {
          inMemoryRepoIndex = parsed;
          return parsed.entries;
        }
      }
    } catch {}
  }

  try {
    const collected: DiscoveredRepoEntry[] = [];
    for (let page = 1; page <= 5; page++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const url = `${API_HOST}/users/${OWNER_ACCOUNT}/repos?per_page=100&page=${page}&sort=updated${
        forceRefresh ? `&_t=${now}` : ''
      }`;
      const res = await fetch(url, {
        signal: ctrl.signal,
        cache: forceRefresh ? 'reload' : 'no-store',
        headers: { Accept: 'application/vnd.github+json' },
      });
      clearTimeout(timer);

      if (!res.ok) {
        if (page === 1) break;
        else break;
      }

      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) break;

      for (const item of items) {
        if (item && item.name) {
          collected.push({
            name: String(item.name),
            branch: String(item.default_branch || 'main'),
            hasPages: Boolean(item.has_pages),
            size: Number(item.size) || 0,
          });
        }
      }

      if (items.length < 100) break;
    }

    if (collected.length > 0) {
      inMemoryRepoIndex = { entries: collected, timestamp: now };
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(
            REPO_INDEX_CACHE_KEY,
            JSON.stringify(inMemoryRepoIndex)
          );
        } catch {}
      }
      return collected;
    }
  } catch {}

  if (inMemoryRepoIndex) return inMemoryRepoIndex.entries;
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(REPO_INDEX_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.entries)) return parsed.entries;
      }
    } catch {}
  }
  return null;
}

async function fetchHtmlForSlug(
  slug: string,
  branch = 'main',
  forceRefresh = false
): Promise<{ html: string; liveTitle?: string } | null> {
  const now = Date.now();
  const candidates = [
    `${RAW_HOST}/${OWNER_ACCOUNT}/${slug}/${branch}/index.html${forceRefresh ? `?_t=${now}` : ''}`,
    `${PAGES_HOST}/${slug}/${forceRefresh ? `?v=${now}` : ''}`,
  ];
  if (branch !== 'master') {
    candidates.push(`${RAW_HOST}/${OWNER_ACCOUNT}/${slug}/master/index.html`);
  }

  for (const url of candidates) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5500);
      const res = await fetch(url, {
        signal: ctrl.signal,
        cache: forceRefresh ? 'reload' : 'no-cache',
      });
      clearTimeout(timer);
      if (res.ok) {
        const text = await res.text();
        if (
          text &&
          text.length > 200 &&
          !text.includes('<title>Page not found') &&
          !text.includes("There isn't a GitHub Pages site here")
        ) {
          let liveTitle: string | undefined;
          const m = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          if (m && m[1]) {
            const cleaned = cleanQuestionTitle(m[1]);
            if (cleaned) liveTitle = cleaned;
          }
          return {
            html: prepareSafeSrcDocHtml(text),
            liveTitle,
          };
        }
      }
    } catch {}
  }
  return null;
}

async function fetchBackendJson(
  pathSuffix: string,
  init?: RequestInit,
  timeoutMs = 6500
): Promise<any | null> {
  if (!hasSameOriginBackend()) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(pathSuffix, {
      ...init,
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return null;
}

async function directClientSyncCurricula(forceRefresh = false): Promise<Eot2026Curriculum[]> {
  const now = Date.now();
  let baseT1: Eot2026Curriculum[] = [];

  try {
    const rawUrl = `${RAW_HOST}/${OWNER_ACCOUNT}/EOT/main/src/data/eotCurricula.ts?_t=${now}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(rawUrl, {
      signal: ctrl.signal,
      cache: forceRefresh ? 'reload' : 'no-store',
    });
    clearTimeout(timer);

    if (res.ok) {
      const code = await res.text();
      const parsed = parseTsArraySafe(code, 'BASE_2026_T1_CURRICULA');
      if (Array.isArray(parsed) && parsed.length > 0) {
        baseT1 = parsed.map((item: any) => {
          const id = String(item.id);
          const tplList: string[] = [];
          if (item.primaryUrlTemplate) {
            tplList.push(extractSlugFromTemplate(String(item.primaryUrlTemplate)));
          }
          if (Array.isArray(item.fallbackUrlTemplates)) {
            for (const f of item.fallbackUrlTemplates) {
              tplList.push(extractSlugFromTemplate(String(f)));
            }
          }
          if (tplList.length > 0) {
            customSlugTemplates.set(id, tplList);
          }

          return {
            id,
            year: String(item.year || '2026'),
            term: (String(item.term || 'T1') as Eot2026TermId),
            grade: String(item.grade),
            stream: String(item.stream),
            subject: String(item.subject),
            titleAr: String(item.titleAr),
            titleEn: String(item.titleEn),
            subtitleAr: String(item.subtitleAr || ''),
            subtitleEn: String(item.subtitleEn || ''),
            defaultTotalQuestions: Number(item.defaultTotalQuestions) || 25,
            mcqQuestionsEnd: Number(item.mcqQuestionsEnd) || 20,
            knownQuestionTitles: item.knownQuestionTitles,
          };
        });
      }
    }
  } catch {}

  const expanded = expandDefaultCurricula(baseT1.length > 0 ? baseT1 : INITIAL_T1_BASE);

  // Merge auto-discovered repositories across all pages
  const repoEntries = await fetchRepoIndexDirect(forceRefresh);
  if (repoEntries && repoEntries.length > 0) {
    for (const entry of repoEntries) {
      const meta = parseEot2026RepoName(entry.name);
      if (!meta || meta.year !== '2026') continue;

      const existing = expanded.find(
        (c) =>
          c.year === '2026' &&
          c.term === meta.term &&
          c.grade === meta.grade &&
          c.stream === meta.stream &&
          c.subject === meta.subject
      );

      if (existing) {
        if (meta.q > existing.defaultTotalQuestions) {
          existing.defaultTotalQuestions = meta.q;
        }
      } else {
        const subAr =
          meta.subject === 'physics'
            ? 'فيزياء'
            : meta.subject === 'math'
            ? 'رياضيات'
            : meta.subject === 'chemistry'
            ? 'كيمياء'
            : 'أحياء';
        const subEn =
          meta.subject === 'physics'
            ? 'Physics'
            : meta.subject === 'math'
            ? 'Mathematics'
            : meta.subject === 'chemistry'
            ? 'Chemistry'
            : 'Biology';
        const streamAr =
          meta.stream === 'adv_bridge'
            ? 'متقدم — بريدج'
            : meta.stream === 'adv_inspire'
            ? 'متقدم — انسباير'
            : 'عام';
        const streamEn =
          meta.stream === 'adv_bridge'
            ? 'Advanced — Bridge'
            : meta.stream === 'adv_inspire'
            ? 'Advanced — Inspire'
            : 'General';

        const newId = `${meta.grade}-${meta.stream.replace('_', '-')}-${meta.subShort}-${meta.term.toLowerCase()}-2026`;
        const slugTpl = entry.name.replace(/([-._]?)Q\d+$/i, '$1Q{q}');
        customSlugTemplates.set(newId, [slugTpl]);

        expanded.push({
          id: newId,
          year: '2026',
          term: meta.term,
          grade: meta.grade,
          stream: meta.stream,
          subject: meta.subject,
          titleAr: `${subAr} ${meta.grade} ${streamAr}`,
          titleEn: `Grade ${meta.grade} ${streamEn} ${subEn}`,
          subtitleAr: 'هيكل امتحان نهاية الفصل · مقسم صفحة لكل سؤال وزاري مع التدريب التفاعلي',
          subtitleEn: 'EOT Exam Structure · Dedicated interactive page per exam question',
          defaultTotalQuestions: Math.max(25, meta.q),
          mcqQuestionsEnd: 20,
        });
      }
    }
  }

  inMemoryCurriculaList = expanded;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CURRICULA_CACHE_KEY, JSON.stringify(expanded));
    } catch {}
  }
  return expanded;
}

export async function syncLiveEot2026Curricula(forceRefresh = false): Promise<{
  curricula: Eot2026Curriculum[];
  sharedCounts: Record<string, number>;
}> {
  if (hasSameOriginBackend()) {
    const qs = forceRefresh ? '?refresh=true' : '';
    const data = await fetchBackendJson(`/api/external-banks/eot2026${qs}`, undefined, 7500);
    if (data && data.success && Array.isArray(data.curricula) && data.curricula.length > 0) {
      inMemoryCurriculaList = data.curricula;
      try {
        window.localStorage.setItem(CURRICULA_CACHE_KEY, JSON.stringify(data.curricula));
      } catch {}
      return {
        curricula: data.curricula,
        sharedCounts: data.sharedSettings?.totalQuestionsByCurriculum || loadLocalQuestionCounts(),
      };
    }
  }

  const liveCurricula = await directClientSyncCurricula(forceRefresh);
  return {
    curricula: liveCurricula,
    sharedCounts: loadLocalQuestionCounts(),
  };
}

export async function probeLiveEot2026Batch(
  curriculumIds: string[],
  maxQuestions = 25,
  forceRefresh = false
): Promise<Record<string, Record<number, EotQuestionProbeResult>>> {
  if (hasSameOriginBackend()) {
    const data = await fetchBackendJson(
      '/api/external-banks/eot2026/probe-batch',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curriculumIds, maxQuestions, forceRefresh }),
      },
      12000
    );
    if (data && data.success && data.probes) {
      return data.probes;
    }
  }

  const result: Record<string, Record<number, EotQuestionProbeResult>> = {};
  const now = Date.now();
  const repoEntries = await fetchRepoIndexDirect(forceRefresh);
  const cachedTitles = loadCachedTitles();
  let titlesUpdated = false;

  const curriculaMap = new Map<string, Eot2026Curriculum>();
  for (const c of inMemoryCurriculaList) {
    curriculaMap.set(c.id, c);
  }

  if (repoEntries && repoEntries.length > 0) {
    // Build lowercase lookup map of all non-empty repos (0 404 requests!)
    const repoByLowerName = new Map<string, DiscoveredRepoEntry>();
    const repoByMetaKey = new Map<string, DiscoveredRepoEntry>();

    for (const entry of repoEntries) {
      repoByLowerName.set(entry.name.toLowerCase(), entry);
      const parsed = parseEot2026RepoName(entry.name);
      if (parsed && parsed.year === '2026') {
        const mKey = `${parsed.grade}__${parsed.stream}__${parsed.subject}__${parsed.term}__Q${parsed.q}`;
        repoByMetaKey.set(mKey, entry);
      }
    }

    const titleFetchTasks: { cid: string; q: number; entry: DiscoveredRepoEntry }[] = [];

    for (const cid of curriculumIds) {
      result[cid] = {};
      const curr = curriculaMap.get(cid);
      if (!curr) continue;
      const total = Math.max(maxQuestions, curr.defaultTotalQuestions || 25);

      for (let q = 1; q <= total; q++) {
        let matchedEntry = repoByMetaKey.get(
          `${curr.grade}__${curr.stream}__${curr.subject}__${curr.term}__Q${q}`
        );

        if (!matchedEntry) {
          const candidates = buildCandidateSlugsForCurriculum(curr, q);
          for (const cand of candidates) {
            const found = repoByLowerName.get(cand.toLowerCase());
            if (found) {
              matchedEntry = found;
              break;
            }
          }
        }

        if (matchedEntry) {
          const titleKey = `${cid}__Q${q}`;
          const existingTitle = !forceRefresh ? cachedTitles[titleKey] : undefined;
          if (existingTitle) {
            result[cid][q] = {
              status: 'live',
              liveTitle: existingTitle,
              checkedAt: now,
            };
          } else {
            result[cid][q] = {
              status: 'pending',
              checkedAt: now,
            };
            titleFetchTasks.push({ cid, q, entry: matchedEntry });
          }
        } else {
          result[cid][q] = {
            status: 'pending',
            checkedAt: now,
          };
        }
      }
    }

    // Verify index.html & fetch live titles + pre-warm HTML cache concurrently for matched repos
    if (titleFetchTasks.length > 0) {
      const workers = Array.from(
        { length: Math.min(10, titleFetchTasks.length) },
        async () => {
          while (titleFetchTasks.length > 0) {
            const task = titleFetchTasks.shift();
            if (!task) break;
            const fetched = await fetchHtmlForSlug(
              task.entry.name,
              task.entry.branch,
              forceRefresh
            );
            if (fetched) {
              const cacheKey = `${task.cid}__Q${task.q}`;
              const effectiveTitle =
                fetched.liveTitle ||
                curriculaMap.get(task.cid)?.knownQuestionTitles?.[task.q]?.ar ||
                `Question ${task.q}`;
              cachedTitles[cacheKey] = effectiveTitle;
              titlesUpdated = true;
              result[task.cid][task.q] = {
                status: 'live',
                liveTitle: fetched.liveTitle,
                checkedAt: now,
              };
              clientQuestionHtmlCache.set(cacheKey, {
                status: 'live',
                liveTitle: fetched.liveTitle,
                html: fetched.html,
                checkedAt: now,
              });
            }
          }
        }
      );
      await Promise.all(workers);
      if (titlesUpdated) {
        saveCachedTitles(cachedTitles);
      }
    }

    return result;
  }

  // Fallback if GitHub REST API is rate-limited: probe primary raw URL directly
  const directTasks: { curr: Eot2026Curriculum; q: number }[] = [];
  for (const cid of curriculumIds) {
    result[cid] = {};
    const curr = curriculaMap.get(cid);
    if (!curr) continue;
    for (let q = 1; q <= maxQuestions; q++) {
      directTasks.push({ curr, q });
    }
  }

  const fallbackWorkers = Array.from(
    { length: Math.min(8, Math.max(1, directTasks.length)) },
    async () => {
      while (directTasks.length > 0) {
        const item = directTasks.shift();
        if (!item) break;
        const slugs = buildCandidateSlugsForCurriculum(item.curr, item.q);
        const primarySlug = slugs[0];
        if (!primarySlug) continue;
        const hit = await fetchHtmlForSlug(primarySlug, 'main', forceRefresh);
        if (hit) {
          const cacheKey = `${item.curr.id}__Q${item.q}`;
          clientQuestionHtmlCache.set(cacheKey, {
            status: 'live',
            liveTitle: hit.liveTitle,
            html: hit.html,
            checkedAt: now,
          });
          result[item.curr.id][item.q] = {
            status: 'live',
            liveTitle: hit.liveTitle,
            checkedAt: now,
          };
        } else {
          result[item.curr.id][item.q] = {
            status: 'pending',
            checkedAt: now,
          };
        }
      }
    }
  );
  await Promise.all(fallbackWorkers);

  return result;
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

  if (hasSameOriginBackend()) {
    const qs = `?curriculumId=${encodeURIComponent(curriculumId)}&q=${q}${
      forceRefresh ? '&refresh=true' : ''
    }`;
    const data = await fetchBackendJson(`/api/external-banks/eot2026/question${qs}`, undefined, 8000);
    if (data && data.success && data.status === 'live' && data.html) {
      const result: EotQuestionProbeResult = {
        status: 'live',
        liveTitle: data.liveTitle,
        html: data.html,
        checkedAt: data.checkedAt || Date.now(),
      };
      clientQuestionHtmlCache.set(cacheKey, result);
      return result;
    }
  }

  // Direct Client Engine (works seamlessly on static GitHub Pages & everywhere)
  const curr =
    inMemoryCurriculaList.find((c) => c.id === curriculumId) ||
    getInitialEot2026Curricula().find((c) => c.id === curriculumId);

  if (!curr) {
    return { status: 'pending', checkedAt: Date.now() };
  }

  const repoEntries = await fetchRepoIndexDirect(forceRefresh);
  if (repoEntries && repoEntries.length > 0) {
    let matched: DiscoveredRepoEntry | undefined;
    for (const entry of repoEntries) {
      const parsed = parseEot2026RepoName(entry.name);
      if (
        parsed &&
        parsed.year === '2026' &&
        parsed.grade === curr.grade &&
        parsed.stream === curr.stream &&
        parsed.subject === curr.subject &&
        parsed.term === curr.term &&
        parsed.q === q
      ) {
        matched = entry;
        break;
      }
    }

    if (!matched) {
      const candidates = buildCandidateSlugsForCurriculum(curr, q).map((s) => s.toLowerCase());
      matched = repoEntries.find((e) => candidates.includes(e.name.toLowerCase()));
    }

    if (matched) {
      const fetched = await fetchHtmlForSlug(matched.name, matched.branch, forceRefresh);
      if (fetched) {
        const res: EotQuestionProbeResult = {
          status: 'live',
          liveTitle: fetched.liveTitle,
          html: fetched.html,
          checkedAt: Date.now(),
        };
        clientQuestionHtmlCache.set(cacheKey, res);
        if (fetched.liveTitle) {
          const cachedTitles = loadCachedTitles();
          cachedTitles[cacheKey] = fetched.liveTitle;
          saveCachedTitles(cachedTitles);
        }
        return res;
      }
    }
  }

  // Direct slug fallback (in case repo index hasn't indexed a 1-second-old push yet or is rate-limited)
  const slugs = buildCandidateSlugsForCurriculum(curr, q);
  for (const slug of slugs) {
    const fetched = await fetchHtmlForSlug(slug, 'main', forceRefresh);
    if (fetched) {
      const res: EotQuestionProbeResult = {
        status: 'live',
        liveTitle: fetched.liveTitle,
        html: fetched.html,
        checkedAt: Date.now(),
      };
      clientQuestionHtmlCache.set(cacheKey, res);
      return res;
    }
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

  if (hasSameOriginBackend()) {
    await fetchBackendJson(
      '/api/external-banks/eot2026/shared-settings',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curriculumId, totalQuestions }),
      },
      5000
    );
  }
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
