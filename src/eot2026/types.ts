export type EotLanguage = 'ar' | 'en';
export type Eot2026TermId = 'T1' | 'T2' | 'T3';
export type Eot2026GradeId = '12' | '11' | '10' | '9' | string;
export type Eot2026StreamId = 'adv_bridge' | 'adv_inspire' | 'general' | string;
export type Eot2026SubjectId = 'physics' | 'math' | 'chemistry' | 'biology' | string;
export type Eot2026AppView = 'hub' | 'workspace' | 'matrix';

export interface Eot2026Curriculum {
  id: string;
  year: string;
  term: Eot2026TermId;
  grade: Eot2026GradeId;
  stream: Eot2026StreamId;
  subject: Eot2026SubjectId;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  defaultTotalQuestions: number;
  mcqQuestionsEnd: number;
  knownQuestionTitles?: Record<
    number,
    {
      ar: string;
      en: string;
    }
  >;
}

export type EotProbeStatus = 'idle' | 'checking' | 'live' | 'pending';

export interface EotQuestionProbeResult {
  status: EotProbeStatus;
  liveTitle?: string;
  html?: string;
  checkedAt?: number;
}

export interface EotStudentProgressStore {
  completed: Record<string, number[]>;
  bookmarked: Record<string, number[]>;
  notes: Record<string, string>;
  lastVisited?: {
    curriculumId: string;
    questionNumber: number;
  };
}
