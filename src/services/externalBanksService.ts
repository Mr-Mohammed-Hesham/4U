// =========================================================================
// 🌐 External Live Banks Service: IG-Exam-Bank & SAT-Math-Bank
// Real-time synchronization with:
// 1. https://github.com/Mr-Mohammed-Hesham/SAT-Math-Bank
// 2. https://github.com/Mr-Mohammed-Hesham/IG-Exam-Bank
//
// Anti-Theft Protection:
// - All exams load as sanitized, protected srcDoc HTML.
// - Zero repository URLs or GitHub links are ever exposed to the end user.
// - Right-click, Ctrl+U (view source), and Ctrl+S are strictly blocked.
// - Real-time sync ensures any updates made in the sub-platforms appear immediately.
// =========================================================================

export interface IGExamItem {
  id: string;
  repoName?: string;
  subject: 'physics' | 'math';
  code: string;
  paperCode: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  session: string;
  sessionAr: string;
  year: number;
  tier: string;
  tierAr: string;
  durationMinutes: number;
  totalMarks: number;
  questionsCount: number;
  url: string;
  topics: string[];
  topicsAr: string[];
  featured?: boolean;
}

export interface InteractiveMockExam {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  url: string;
  totalQuestions: number;
  durationMinutes: number;
  difficulty: 'Standard' | 'Advanced' | 'Adaptive' | string;
  difficultyAr: string;
  badgeColor: string;
  tags: string[];
}

// Runtime origin builders
const OWNER_ACCOUNT = ['Mr', 'Mohammed', 'Hesham'].join('-');
const RAW_HOST = ['https://raw', 'githubusercontent', 'com'].join('.');
const API_HOST = ['https://api', 'github', 'com'].join('.');

const isBackendServerHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.run.app') ||
    hostname.includes('3000')
  );
};

// Safe LocalStorage helpers
function safeGetStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

// Built-in initial snapshot for IG-Exam-Bank (ensures zero load time even before first network sync)
export const INITIAL_IG_EXAMS_SNAPSHOT: IGExamItem[] = [
  {
    id: 'ig-phy-jun-26-1h',
    subject: 'math',
    code: '4MA1 / 1H (Rev 26)',
    paperCode: '1H',
    title: 'IGCSE Extended Revision Paper 1H (Jun 26 Series)',
    titleAr: 'امتحان IGCSE الشامل - الورقة 1H (إصدار المراجعة المتقدمة)',
    subtitle: 'Extended Tier — 25 Questions across 5 Sections',
    subtitleAr: 'المستوى المتقدم — 25 سؤالاً في 5 أقسام شاملة',
    description: 'Comprehensive interactive paper covering Fractions, Trigonometry, Sets, Inequalities, Equations, Probability, Bounds, and Calculus.',
    descriptionAr: 'اختبار تفاعلي شامل يغطي الكسور، حساب المثلثات، المجموعات، المتباينات، المعادلات، الاحتمالات، الحدود العليا والدنيا، والتفاضل.',
    session: 'Comprehensive Series',
    sessionAr: 'النماذج الشاملة والمجمعة',
    year: 2026,
    tier: 'Higher',
    tierAr: 'المستوى المتقدم (Higher)',
    durationMinutes: 120,
    totalMarks: 100,
    questionsCount: 25,
    url: 'https://mr-mohammed-hesham.github.io/Ig-Edexcel-Phy-Jun-26-1H/',
    topics: ['Trigonometry', 'Sets & Venn', 'Bounds', 'Calculus', 'Probability'],
    topicsAr: ['حساب المثلثات', 'المجموعات', 'الحدود', 'التفاضل', 'الاحتمالات'],
    featured: true
  },
  {
    id: 'ig-phy-jun-18-2p',
    subject: 'physics',
    code: '4PH1 / 2P',
    paperCode: '2P',
    title: 'IGCSE Physics Paper 2P — June 2018',
    titleAr: 'امتحان فيزياء IGCSE الورقة 2P — يونيو 2018',
    subtitle: 'Official Edexcel Past Paper (Paper 2P)',
    subtitleAr: 'الامتحان الرسمي المعتمد من إدكسل (الورقة 2P)',
    description: 'Interactive exam covering Thermal Physics, Magnetism, Astrophysics, Light & Sound, and Radioactivity.',
    descriptionAr: 'اختبار تفاعلي يغطي الفيزياء الحرارية، المغناطيسية، فيزياء الفلك، الضوء والصوت، والنشاط الإشعاعي.',
    session: 'June 2018',
    sessionAr: 'دورة يونيو 2018',
    year: 2018,
    tier: 'Higher',
    tierAr: 'المستوى المتقدم (Higher)',
    durationMinutes: 75,
    totalMarks: 70,
    questionsCount: 16,
    url: 'https://mr-mohammed-hesham.github.io/Ig-Edexcel-Phy-Jun-18-2P/',
    topics: ['Thermal Energy', 'Magnetism', 'Astrophysics', 'Radioactivity'],
    topicsAr: ['الطاقة الحرارية', 'المغناطيسية', 'فيزياء الفلك', 'الإشعاع'],
    featured: true
  },
  {
    id: 'ig-math-jun19-1h',
    subject: 'math',
    code: '4MA1 / 1H',
    paperCode: '1H',
    title: 'IGCSE Mathematics Paper 1H — June 2019',
    titleAr: 'امتحان رياضيات IGCSE الورقة 1H — يونيو 2019',
    subtitle: 'Higher Tier Official Paper',
    subtitleAr: 'المستوى المتقدم - الامتحان الرسمي',
    description: 'Full official Paper 1H covering Algebra, Geometry, Statistics, and Functions.',
    descriptionAr: 'الامتحان الرسمي الكامل 1H يغطي الجبر، الهندسة، الإحصاء، والدوال.',
    session: 'June 2019',
    sessionAr: 'دورة يونيو 2019',
    year: 2019,
    tier: 'Higher',
    tierAr: 'المستوى المتقدم (Higher)',
    durationMinutes: 120,
    totalMarks: 100,
    questionsCount: 22,
    url: 'https://mr-mohammed-hesham.github.io/Ig-Edexcel-math-Jun19-1H/',
    topics: ['Algebra', 'Functions', 'Geometry', 'Statistics'],
    topicsAr: ['الجبر', 'الدوال', 'الهندسة', 'الإحصاء'],
    featured: true
  },
  {
    id: 'ig-math-jan21-all',
    subject: 'math',
    code: '4MA1 / Jan 21 Suite',
    paperCode: 'ALL',
    title: 'IGCSE Mathematics Complete Suite — January 2021 (1H, 1HR, 2H, 2HR)',
    titleAr: 'مجموعة امتحانات رياضيات IGCSE الكاملة — يناير 2021',
    subtitle: 'Complete 4-Paper Bundle with Instant Correction',
    subtitleAr: 'حزمة الأوراق الأربعة الكاملة مع التصحيح الفوري',
    description: 'Comprehensive 4-paper suite with all versions (1H, 1HR, 2H, 2HR) for January 2021.',
    descriptionAr: 'مجموعة شاملة للأوراق الأربعة لشهادة يناير 2021 مع تقارير دقيقة ومفصلة.',
    session: 'January 2021',
    sessionAr: 'دورة يناير 2021',
    year: 2021,
    tier: 'Higher',
    tierAr: 'المستوى المتقدم (Higher)',
    durationMinutes: 120,
    totalMarks: 100,
    questionsCount: 25,
    url: 'https://mr-mohammed-hesham.github.io/Ig-Edexcel-math-Jan21/',
    topics: ['Algebra', 'Sequences', 'Vectors', 'Probability'],
    topicsAr: ['الجبر', 'المتتاليات', 'المتجهات', 'الاحتمالات'],
    featured: true
  }
];

// Built-in initial snapshot for SAT-Math-Bank Interactive Revision Exams
export const INITIAL_SAT_MOCKS_SNAPSHOT: InteractiveMockExam[] = [
  {
    id: 'mock-m4',
    code: 'Mock M4',
    title: 'SAT Math Comprehensive Revision - Mock M4',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M4',
    subtitle: 'Standard Digital SAT Mock Model 4',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 4',
    description: 'Comprehensive timed practice exam covering foundational algebra, linear equations, functions, and standard word problems.',
    descriptionAr: 'اختبار محاكاة شامل ومؤقت يغطي أساسيات الجبر، المعادلات الخطية، الدوال، والمسائل الكلامية القياسية.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M4/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-blue-600 to-cyan-600',
    tags: ['Algebra', 'Functions', 'Linear Systems']
  },
  {
    id: 'mock-m5',
    code: 'Mock M5',
    title: 'SAT Math Comprehensive Revision - Mock M5',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M5',
    subtitle: 'Standard Digital SAT Mock Model 5',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 5',
    description: 'Focused test on quadratics, parabolas, vertex form, discriminant analysis, and systems of equations.',
    descriptionAr: 'اختبار مركز على المعادلات التربيعية، القطوع المكافئة، صيغة الرأس، المميز، وأنظمة المعادلات.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M5/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-cyan-600 to-teal-600',
    tags: ['Quadratics', 'Parabolas', 'Nonlinear Systems']
  },
  {
    id: 'mock-m6',
    code: 'Mock M6',
    title: 'SAT Math Comprehensive Revision - Mock M6',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M6',
    subtitle: 'Standard Digital SAT Mock Model 6',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 6',
    description: 'Complete practice test with balanced Module 1 and Module 2 difficulty distribution.',
    descriptionAr: 'اختبار محاكاة متوازن يغطي الوحدتين الأولى والثانية بأسلوب الكوليدج بورد.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M6/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-emerald-600 to-teal-600',
    tags: ['Advanced Math', 'Exponentials', 'Trigonometry']
  },
  {
    id: 'mock-m6-1',
    code: 'Mock M6.1',
    title: 'SAT Math Comprehensive Revision - Mock M6.1 (Advanced)',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M6.1 (متقدم)',
    subtitle: 'High-Difficulty Digital SAT Model 6.1',
    subtitleAr: 'نموذج السات الرقمي عالي الصعوبة 6.1',
    description: 'Advanced Module 2 practice with challenging circle equations, complex numbers, and data analysis.',
    descriptionAr: 'تدريب متقدم يركز على أسئلة الوحدة الثانية الصعبة: معادلات الدوائر، الإحصاء، والمسائل المركبة.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M6-1/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    badgeColor: 'from-indigo-600 to-purple-600',
    tags: ['Circle Equations', 'Geometry', 'Challenging M2']
  },
  {
    id: 'mock-m7',
    code: 'Mock M7',
    title: 'SAT Math Comprehensive Revision - Mock M7',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M7',
    subtitle: 'Standard Digital SAT Mock Model 7',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 7',
    description: 'Full mock model covering exponents, radicals, rational expressions, and word problem modeling.',
    descriptionAr: 'نموذج كامل يغطي الأسس، الجذور، المقادير النسبية، ونمذجة المسائل اللفظية.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M7/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-purple-600 to-pink-600',
    tags: ['Radicals', 'Exponents', 'Rational Functions']
  },
  {
    id: 'mock-m7-1',
    code: 'Mock M7.1',
    title: 'SAT Math Comprehensive Revision - Mock M7.1 (Advanced)',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M7.1 (متقدم)',
    subtitle: 'Intensive Adaptive Model 7.1',
    subtitleAr: 'النموذج التكيفي المكثف 7.1',
    description: 'High-scoring targeted mock for students targeting 750+ on Digital SAT Math.',
    descriptionAr: 'نموذج مكثف مخصص للطلاب المستهدفين لدرجة 750+ في رياضيات السات الرقمي.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M7-1/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    badgeColor: 'from-violet-600 to-indigo-600',
    tags: ['Target 750+', 'Hard Module 2', 'Data Analysis']
  },
  {
    id: 'mock-m8',
    code: 'Mock M8',
    title: 'SAT Math Comprehensive Revision - Mock M8',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M8',
    subtitle: 'Standard Digital SAT Mock Model 8',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 8',
    description: 'Full model simulating realistic Digital SAT test conditions with Desmos tips and tricks.',
    descriptionAr: 'نموذج كامل يحاكي ظروف الامتحان الحقيقية مع تدريبات على استخدام ديسموس بذكاء.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M8/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-amber-600 to-orange-600',
    tags: ['Desmos Shortcuts', 'Algebra', 'Trigonometry']
  },
  {
    id: 'mock-m8-1',
    code: 'Mock M8.1',
    title: 'SAT Math Comprehensive Revision - Mock M8.1 (Intensive)',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M8.1 (مكثف)',
    subtitle: 'Hard Module Focused Model 8.1',
    subtitleAr: 'نموذج مكثف بتركيز على أسئلة الوحدة الثانية 8.1',
    description: 'Rigorous 44-question mock test with challenging geometry, similar triangles, and probability.',
    descriptionAr: 'اختبار دقيق من 44 سؤالاً يركز على هندسة المثلثات المتشابهة ونظريات الاحتمالات.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M8-1/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    badgeColor: 'from-rose-600 to-red-600',
    tags: ['Geometry', 'Similar Triangles', 'Probability']
  },
  {
    id: 'mock-m9',
    code: 'Mock M9',
    title: 'SAT Math Comprehensive Revision - Mock M9',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M9',
    subtitle: 'Standard Digital SAT Mock Model 9',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 9',
    description: 'Full Digital SAT Math mock covering linear modeling, scatterplots, line of best fit, and percentages.',
    descriptionAr: 'نموذج متكامل يغطي النمذجة الخطية، مخططات الانتشار، خط أفضل مطابقة، والنسب المئوية.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M9/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-blue-600 to-indigo-600',
    tags: ['Statistics', 'Scatterplots', 'Percentages']
  },
  {
    id: 'mock-m9-1',
    code: 'Mock M9.1',
    title: 'SAT Math Comprehensive Revision - Mock M9.1 (Challenge)',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M9.1 (تحدي)',
    subtitle: 'Expert Digital SAT Model 9.1',
    subtitleAr: 'نموذج التحدي للخبراء 9.1',
    description: 'Challenging questions designed to simulate the hardest variants of Digital SAT Math Module 2.',
    descriptionAr: 'أسئلة تحدٍ مصممة لمحاكاة أصعب نماذج الوحدة الثانية في امتحان السات الرقمي.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M9-1/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    badgeColor: 'from-teal-600 to-emerald-600',
    tags: ['Challenge', 'Advanced Math', 'Hard Module 2']
  },
  {
    id: 'mock-m10',
    code: 'Mock M10',
    title: 'SAT Math Comprehensive Revision - Mock M10',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M10',
    subtitle: 'Standard Digital SAT Mock Model 10',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 10',
    description: 'Comprehensive 44-question timed mock model featuring real-style College Board question formats.',
    descriptionAr: 'نموذج محاكاة موقوت وشامل من 44 سؤالاً يحاكي أسئلة الكوليدج بورد بدقة متناهية.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M10/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-indigo-600 to-blue-600',
    tags: ['Algebra', 'Geometry', 'Functions']
  },
  {
    id: 'mock-m10-1',
    code: 'Mock M10.1',
    title: 'SAT Math Comprehensive Revision - Mock M10.1 (Hard Module 2 Focus)',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M10.1 (تركيز الوحدة 2 الصعبة)',
    subtitle: 'Expert Hard Module 2 Model 10.1',
    subtitleAr: 'نموذج الخبراء للوحدة الثانية الصعبة 10.1',
    description: 'Intense focus on the upper percentile questions in functions, systems, circles, and trigonometry.',
    descriptionAr: 'تركيز مكثف على أسئلة الشريحة العليا في الدوال، الأنظمة، الدوائر، وحساب المثلثات.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M10-1/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    badgeColor: 'from-purple-600 to-violet-600',
    tags: ['Upper Percentile', 'Hard Module 2', 'Circles']
  },
  {
    id: 'mock-m11',
    code: 'Mock M11',
    title: 'SAT Math Comprehensive Revision - Mock M11',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M11',
    subtitle: 'Standard Digital SAT Mock Model 11',
    subtitleAr: 'نموذج محاكاة السات الرقمي القياسي 11',
    description: 'Standard 44-question full practice test covering all 4 Digital SAT Math domains.',
    descriptionAr: 'اختبار تدريبي كامل من 44 سؤالاً يغطي المجالات الأربعة لاختبار السات الرقمي.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M11/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Standard',
    difficultyAr: 'قياسي',
    badgeColor: 'from-amber-600 to-yellow-600',
    tags: ['All 4 Domains', 'Standard', 'Balanced']
  },
  {
    id: 'mock-m11-1',
    code: 'Mock M11.1',
    title: 'SAT Math Comprehensive Revision - Mock M11.1 (Final Challenge)',
    titleAr: 'نموذج محاكاة مراجعة السات الشاملة - الموديل M11.1 (التحدي النهائي)',
    subtitle: 'Final Master Challenge Model 11.1',
    subtitleAr: 'نموذج التحدي النهائي للمتفوقين 11.1',
    description: 'The ultimate Digital SAT Math challenge paper for maximum score readiness.',
    descriptionAr: 'اختبار التحدي النهائي في رياضيات السات الرقمي لتحقيق الجاهزية القصوى للدرجة الكاملة.',
    url: 'https://mr-mohammed-hesham.github.io/sat-math-revision-M11-1/',
    totalQuestions: 44,
    durationMinutes: 70,
    difficulty: 'Advanced',
    difficultyAr: 'متقدم',
    badgeColor: 'from-red-600 to-rose-600',
    tags: ['Final Challenge', 'Score 800 Prep', 'Mastery']
  }
];

// In-memory cache
let cachedIgExams: IGExamItem[] | null = null;
let cachedSatMocks: InteractiveMockExam[] | null = null;
let lastIgFetchTime = 0;
let lastSatFetchTime = 0;
const examHtmlCache = new Map<string, { html: string; timestamp: number }>();

// Extract repository slug from URL or bare name
export function extractRepoSlug(urlOrSlug: string): string {
  if (!urlOrSlug) return '';
  return urlOrSlug
    .replace(/^https?:\/\/[^/]+\//i, '')
    .replace(/\/+$/, '')
    .replace(/[?#].*$/, '')
    .trim();
}

export function extractOwnerFromUrl(urlOrSlug: string): string {
  if (!urlOrSlug) return OWNER_ACCOUNT;
  const match = urlOrSlug.match(/^https?:\/\/([^.]+)\.github\.io/i);
  if (match && match[1]) {
    return match[1];
  }
  return OWNER_ACCOUNT;
}

// Anti-theft HTML sanitizer & protection injector
export function prepareSafeExamHtml(rawHtml: string): string {
  let html = rawHtml
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']twitter:url["'][^>]*>/gi, '');

  const protectionScript = `<script>
(function(){
  try {
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    window.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
    document.addEventListener('DOMContentLoaded', function() {
      var links = document.querySelectorAll('a[href*="github.com"], a[href*="github.io"]');
      links.forEach(function(l){ l.style.display = 'none'; l.removeAttribute('href'); });
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

// Fetch safe HTML for any exam using backend proxy or direct raw GitHub (zero CORS issues)
export async function fetchSafeExamHtml(
  urlOrSlug: string,
  forceRefresh = false
): Promise<string | null> {
  const slug = extractRepoSlug(urlOrSlug);
  if (!slug) return null;
  const owner = extractOwnerFromUrl(urlOrSlug);

  const now = Date.now();
  if (!forceRefresh) {
    const cached = examHtmlCache.get(slug);
    if (cached && now - cached.timestamp < 120000) {
      return cached.html;
    }
  }

  // 1. Backend Proxy (Handles CORS, caching, and anti-theft)
  if (isBackendServerHost()) {
    try {
      const apiUrl = `/api/external-banks/exam-html?slug=${encodeURIComponent(slug)}&owner=${encodeURIComponent(owner)}&url=${encodeURIComponent(urlOrSlug)}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(apiUrl, { cache: forceRefresh ? 'reload' : 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.html) {
          examHtmlCache.set(slug, { html: data.html, timestamp: now });
          return data.html;
        }
      }
    } catch {}
  }

  // 2. Direct Cross-Origin Fetch from GitHub Raw and Pages
  const candidateUrls = [
    `${RAW_HOST}/${owner}/${slug}/main/index.html${forceRefresh ? `?_t=${now}` : ''}`,
    `${RAW_HOST}/${owner}/${slug}/master/index.html${forceRefresh ? `?_t=${now}` : ''}`,
    `https://${owner.toLowerCase()}.github.io/${slug}/${forceRefresh ? `?_t=${now}` : ''}`,
    `${RAW_HOST}/${OWNER_ACCOUNT}/${slug}/main/index.html${forceRefresh ? `?_t=${now}` : ''}`,
    `${RAW_HOST}/${OWNER_ACCOUNT}/${slug}/master/index.html${forceRefresh ? `?_t=${now}` : ''}`,
    `${RAW_HOST}/hesham-afandi/${slug}/master/index.html${forceRefresh ? `?_t=${now}` : ''}`,
    `${RAW_HOST}/hesham-afandi/${slug}/main/index.html${forceRefresh ? `?_t=${now}` : ''}`,
  ];

  for (const targetUrl of candidateUrls) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6500);
      const res = await fetch(targetUrl, {
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
          const safeHtml = prepareSafeExamHtml(text);
          examHtmlCache.set(slug, { html: safeHtml, timestamp: now });
          return safeHtml;
        }
      }
    } catch {}
  }

  return null;
}

// Client-side parser for TS arrays
function parseTsArrayGeneric<T>(code: string, variableName: string): T[] {
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

    for (let i = arrStart; i < code.length; i++) {
      const ch = code[i];
      const prev = code[i - 1];
      if (inString) {
        if (ch === stringChar && prev !== '\\') inString = false;
      } else {
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T[];
      }
    }
  } catch (err) {
    console.warn(`[ExternalBanks] Client parsing of ${variableName} failed:`, err);
  }
  return [];
}

export function parseIgExamsFromTsCode(code: string): IGExamItem[] {
  return parseTsArrayGeneric<IGExamItem>(code, 'allIGExams');
}

export function parseSatMocksFromTsCode(code: string): InteractiveMockExam[] {
  return parseTsArrayGeneric<InteractiveMockExam>(code, 'interactiveRevisionExams');
}

// Helpers: load stored exams from localStorage
export function getSavedIgExams(): IGExamItem[] {
  const saved = safeGetStorage('4u_ig_exams_bank_cache');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return INITIAL_IG_EXAMS_SNAPSHOT;
}

export function getSavedSatMocks(): InteractiveMockExam[] {
  const saved = safeGetStorage('4u_sat_exams_bank_cache');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return INITIAL_SAT_MOCKS_SNAPSHOT;
}

// Live Fetcher for IG-Exam-Bank
export async function fetchLiveIgExamBank(forceRefresh = false): Promise<{
  exams: IGExamItem[];
  fromLive: boolean;
  count: number;
}> {
  const now = Date.now();
  if (!forceRefresh && cachedIgExams && now - lastIgFetchTime < 60000) {
    return { exams: cachedIgExams, fromLive: true, count: cachedIgExams.length };
  }

  // 1. Try Platform Backend API (only on backend hosts)
  if (isBackendServerHost()) {
    try {
      const apiUrl = `/api/external-banks/ig${forceRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(apiUrl, { cache: forceRefresh ? 'reload' : 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.exams) && data.exams.length > 0) {
          cachedIgExams = data.exams;
          lastIgFetchTime = now;
          safeSetStorage('4u_ig_exams_bank_cache', JSON.stringify(data.exams));
          safeSetStorage('4u_ig_exams_bank_synced_at', new Date().toISOString());
          return { exams: data.exams, fromLive: true, count: data.exams.length };
        }
      }
    } catch {}
  }

  // 2. Direct GitHub Raw Sync (from upstream Mr-Mohammed-Hesham/IG-Exam-Bank)
  try {
    const rawUrl = `${RAW_HOST}/${OWNER_ACCOUNT}/IG-Exam-Bank/main/src/data/igExamsData.ts?_t=${now}`;
    const rawRes = await fetch(rawUrl, {
      cache: forceRefresh ? 'reload' : 'no-cache',
      headers: { Accept: 'text/plain' },
    });
    if (rawRes.ok) {
      const rawText = await rawRes.text();
      const parsed = parseIgExamsFromTsCode(rawText);
      if (parsed.length > 0) {
        cachedIgExams = parsed;
        lastIgFetchTime = now;
        safeSetStorage('4u_ig_exams_bank_cache', JSON.stringify(parsed));
        safeSetStorage('4u_ig_exams_bank_synced_at', new Date().toISOString());
        return { exams: parsed, fromLive: true, count: parsed.length };
      }
    }
  } catch (err) {
    console.warn('[ExternalBanks] Direct GitHub raw fetch for IG failed:', err);
  }

  // 3. Fallback to localStorage or built-in snapshot
  const saved = getSavedIgExams();
  cachedIgExams = saved;
  return { exams: saved, fromLive: false, count: saved.length };
}

// Live Fetcher for SAT-Math-Bank
export async function fetchLiveSatExamBank(forceRefresh = false): Promise<{
  revisionExams: InteractiveMockExam[];
  fromLive: boolean;
  count: number;
}> {
  const now = Date.now();
  if (!forceRefresh && cachedSatMocks && now - lastSatFetchTime < 60000) {
    return { revisionExams: cachedSatMocks, fromLive: true, count: cachedSatMocks.length };
  }

  // 1. Try Platform Backend API (only on backend hosts)
  if (isBackendServerHost()) {
    try {
      const apiUrl = `/api/external-banks/sat${forceRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(apiUrl, { cache: forceRefresh ? 'reload' : 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.revisionExams) && data.revisionExams.length > 0) {
          cachedSatMocks = data.revisionExams;
          lastSatFetchTime = now;
          safeSetStorage('4u_sat_exams_bank_cache', JSON.stringify(data.revisionExams));
          safeSetStorage('4u_sat_exams_bank_synced_at', new Date().toISOString());
          return { revisionExams: data.revisionExams, fromLive: true, count: data.revisionExams.length };
        }
      }
    } catch {}
  }

  // 2. Direct GitHub Raw Sync (from upstream Mr-Mohammed-Hesham/SAT-Math-Bank)
  try {
    const rawUrl = `${RAW_HOST}/${OWNER_ACCOUNT}/SAT-Math-Bank/main/src/data/fullExamsData.ts?_t=${now}`;
    const rawRes = await fetch(rawUrl, {
      cache: forceRefresh ? 'reload' : 'no-cache',
      headers: { Accept: 'text/plain' },
    });
    if (rawRes.ok) {
      const rawText = await rawRes.text();
      const parsed = parseSatMocksFromTsCode(rawText);
      if (parsed.length > 0) {
        cachedSatMocks = parsed;
        lastSatFetchTime = now;
        safeSetStorage('4u_sat_exams_bank_cache', JSON.stringify(parsed));
        safeSetStorage('4u_sat_exams_bank_synced_at', new Date().toISOString());
        return { revisionExams: parsed, fromLive: true, count: parsed.length };
      }
    }
  } catch (err) {
    console.warn('[ExternalBanks] Direct GitHub raw fetch for SAT failed:', err);
  }

  // 3. Fallback to localStorage or built-in snapshot
  const saved = getSavedSatMocks();
  cachedSatMocks = saved;
  return { revisionExams: saved, fromLive: false, count: saved.length };
}
