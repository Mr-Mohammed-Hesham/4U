// =========================================================================
// 🌐 External GitHub Banks Service: IG-Exam-Bank & SAT-Math-Bank
// Connects live with:
// 1. https://github.com/Mr-Mohammed-Hesham/IG-Exam-Bank
// 2. https://github.com/Mr-Mohammed-Hesham/SAT-Math-Bank
// Automatically detects and displays newly added exams in real time!
// =========================================================================

export interface IGExamItem {
  id: string;
  repoName: string;
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

const PRIMARY_CLOUD_RUN_BACKEND = "https://ais-pre-zkin4elv7zwqu2e6fa3gzm-684462415759.europe-west2.run.app";

const getApiUrl = (path: string): string => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname === 'localhost' || hostname.endsWith('run.app') || hostname.includes('3000') || !hostname) {
    return path;
  }
  return `${PRIMARY_CLOUD_RUN_BACKEND}${path}`;
};

// Built-in initial snapshot for IG-Exam-Bank (ensures zero load time even before first network sync)
export const INITIAL_IG_EXAMS_SNAPSHOT: IGExamItem[] = [
  {
    id: 'ig-phy-jun-26-1h',
    repoName: 'Ig-Edexcel-Phy-Jun-26-1H',
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
    repoName: 'Ig-Edexcel-Phy-Jun-18-2P',
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
    repoName: 'Ig-Edexcel-math-Jun19-1H',
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
    repoName: 'Ig-Edexcel-math-Jan21',
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

// Client-side parser for IG exams TypeScript array
export function parseIgExamsFromTsCode(code: string): IGExamItem[] {
  try {
    const startIdx = code.indexOf("allIGExams");
    if (startIdx === -1) return [];
    const eqIdx = code.indexOf("=", startIdx);
    const arrStart = code.indexOf("[", eqIdx);
    if (arrStart === -1) return [];

    let depth = 0;
    let arrEnd = -1;
    let inString = false;
    let stringChar = "";

    for (let i = arrStart; i < code.length; i++) {
      const ch = code[i];
      const prev = code[i - 1];
      if (inString) {
        if (ch === stringChar && prev !== "\\") inString = false;
      } else {
        if (ch === '"' || ch === "'" || ch === '`') {
          inString = true;
          stringChar = ch;
        } else if (ch === "[") depth++;
        else if (ch === "]") {
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
      const parsed = new Function("return " + arrCode)();
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as IGExamItem[];
      }
    }
  } catch (err) {
    console.warn("[ExternalBanks] Client parsing of IG exams failed:", err);
  }
  return [];
}

// Client-side parser for SAT mocks TypeScript array
export function parseSatMocksFromTsCode(code: string): InteractiveMockExam[] {
  try {
    const startIdx = code.indexOf("interactiveRevisionExams");
    if (startIdx === -1) return [];
    const eqIdx = code.indexOf("=", startIdx);
    const arrStart = code.indexOf("[", eqIdx);
    if (arrStart === -1) return [];

    let depth = 0;
    let arrEnd = -1;
    let inString = false;
    let stringChar = "";

    for (let i = arrStart; i < code.length; i++) {
      const ch = code[i];
      const prev = code[i - 1];
      if (inString) {
        if (ch === stringChar && prev !== "\\") inString = false;
      } else {
        if (ch === '"' || ch === "'" || ch === '`') {
          inString = true;
          stringChar = ch;
        } else if (ch === "[") depth++;
        else if (ch === "]") {
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
      const parsed = new Function("return " + arrCode)();
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as InteractiveMockExam[];
      }
    }
  } catch (err) {
    console.warn("[ExternalBanks] Client parsing of SAT mocks failed:", err);
  }
  return [];
}

// Helper: load stored exams from localStorage
export function getSavedIgExams(): IGExamItem[] {
  try {
    const saved = localStorage.getItem('4u_ig_exams_bank_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_IG_EXAMS_SNAPSHOT;
}

export function getSavedSatMocks(): InteractiveMockExam[] {
  try {
    const saved = localStorage.getItem('4u_sat_exams_bank_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_SAT_MOCKS_SNAPSHOT;
}

// Live Fetcher for IG-Exam-Bank
export async function fetchLiveIgExamBank(forceRefresh = false): Promise<{
  exams: IGExamItem[];
  fromLive: boolean;
  count: number;
}> {
  const now = Date.now();
  // 60-second in-memory throttle unless forceRefresh
  if (!forceRefresh && cachedIgExams && (now - lastIgFetchTime < 60000)) {
    return { exams: cachedIgExams, fromLive: true, count: cachedIgExams.length };
  }

  // 1. Try Platform Backend API
  try {
    const apiUrl = getApiUrl(`/api/external-banks/ig${forceRefresh ? '?refresh=true' : ''}`);
    const res = await fetch(apiUrl, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.exams) && data.exams.length > 0) {
        cachedIgExams = data.exams;
        lastIgFetchTime = now;
        localStorage.setItem('4u_ig_exams_bank_cache', JSON.stringify(data.exams));
        localStorage.setItem('4u_ig_exams_bank_synced_at', new Date().toISOString());
        return { exams: data.exams, fromLive: true, count: data.exams.length };
      }
    }
  } catch (err) {
    console.warn("[ExternalBanks] Backend API fetch for IG failed, trying direct GitHub raw:", err);
  }

  // 2. Direct GitHub Raw Fallback (for static deployments or client standalone)
  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/IG-Exam-Bank/main/src/data/igExamsData.ts?_t=${now}`;
    const rawRes = await fetch(rawUrl, { cache: 'no-cache' });
    if (rawRes.ok) {
      const rawText = await rawRes.text();
      const parsed = parseIgExamsFromTsCode(rawText);
      if (parsed.length > 0) {
        cachedIgExams = parsed;
        lastIgFetchTime = now;
        localStorage.setItem('4u_ig_exams_bank_cache', JSON.stringify(parsed));
        localStorage.setItem('4u_ig_exams_bank_synced_at', new Date().toISOString());
        return { exams: parsed, fromLive: true, count: parsed.length };
      }
    }
  } catch (err) {
    console.warn("[ExternalBanks] Direct GitHub raw fetch for IG failed:", err);
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
  // 60-second in-memory throttle unless forceRefresh
  if (!forceRefresh && cachedSatMocks && (now - lastSatFetchTime < 60000)) {
    return { revisionExams: cachedSatMocks, fromLive: true, count: cachedSatMocks.length };
  }

  // 1. Try Platform Backend API
  try {
    const apiUrl = getApiUrl(`/api/external-banks/sat${forceRefresh ? '?refresh=true' : ''}`);
    const res = await fetch(apiUrl, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.revisionExams) && data.revisionExams.length > 0) {
        cachedSatMocks = data.revisionExams;
        lastSatFetchTime = now;
        localStorage.setItem('4u_sat_exams_bank_cache', JSON.stringify(data.revisionExams));
        localStorage.setItem('4u_sat_exams_bank_synced_at', new Date().toISOString());
        return { revisionExams: data.revisionExams, fromLive: true, count: data.revisionExams.length };
      }
    }
  } catch (err) {
    console.warn("[ExternalBanks] Backend API fetch for SAT failed, trying direct GitHub raw:", err);
  }

  // 2. Direct GitHub Raw Fallback (for static deployments or client standalone)
  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/SAT-Math-Bank/main/src/data/fullExamsData.ts?_t=${now}`;
    const rawRes = await fetch(rawUrl, { cache: 'no-cache' });
    if (rawRes.ok) {
      const rawText = await rawRes.text();
      const parsed = parseSatMocksFromTsCode(rawText);
      if (parsed.length > 0) {
        cachedSatMocks = parsed;
        lastSatFetchTime = now;
        localStorage.setItem('4u_sat_exams_bank_cache', JSON.stringify(parsed));
        localStorage.setItem('4u_sat_exams_bank_synced_at', new Date().toISOString());
        return { revisionExams: parsed, fromLive: true, count: parsed.length };
      }
    }
  } catch (err) {
    console.warn("[ExternalBanks] Direct GitHub raw fetch for SAT failed:", err);
  }

  // 3. Fallback to localStorage or built-in snapshot
  const saved = getSavedSatMocks();
  cachedSatMocks = saved;
  return { revisionExams: saved, fromLive: false, count: saved.length };
}
