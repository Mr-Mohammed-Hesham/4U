import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import {
  Eot2026Curriculum,
  Eot2026TermId,
  EotLanguage,
  EotQuestionProbeResult,
} from '../types';
import { EOT2026_TERMS, getGradeLabel2026, getStreamLabel2026 } from '../eot2026LiveService';
import { OrbitalStructureLoader } from './OrbitalStructureLoader';

interface QuestionWorkspace2026ViewProps {
  curriculum: Eot2026Curriculum;
  curriculaForSelection: Eot2026Curriculum[];
  onSwitchTo2025: () => void;
  selectedTerm: Eot2026TermId;
  onTermChange: (term: Eot2026TermId) => void;
  onSelectCurriculum: (curriculumId: string) => void;
  questionNumber: number;
  totalQuestions: number;
  onSelectQuestion: (q: number) => void;
  onUpdateTotalQuestions: (curriculumId: string, count: number) => void;
  activeQuestionData?: EotQuestionProbeResult;
  curriculumProbes: Record<number, EotQuestionProbeResult>;
  isScanningCurriculum: boolean;
  onReloadQuestion: (q: number) => void;
  onScanEntireCurriculum: () => void;
  isCompleted: boolean;
  completedQuestions: number[];
  onToggleCompleted: (q: number) => void;
  isBookmarked: boolean;
  bookmarkedQuestions: number[];
  onToggleBookmarked: (q: number) => void;
  noteText: string;
  onChangeNote: (text: string) => void;
  onBackToHub: () => void;
  language: EotLanguage;
}

export const QuestionWorkspace2026View: React.FC<QuestionWorkspace2026ViewProps> = ({
  curriculum,
  curriculaForSelection,
  onSwitchTo2025,
  selectedTerm,
  onTermChange,
  onSelectCurriculum,
  questionNumber,
  totalQuestions,
  onSelectQuestion,
  onUpdateTotalQuestions,
  activeQuestionData,
  curriculumProbes,
  isScanningCurriculum,
  onReloadQuestion,
  onScanEntireCurriculum,
  isCompleted,
  completedQuestions,
  onToggleCompleted,
  isBookmarked,
  bookmarkedQuestions,
  onToggleBookmarked,
  noteText,
  onChangeNote,
  onBackToHub,
  language,
}) => {
  const isEn = language === 'en';
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'live' | 'done' | 'saved'>('all');
  const [isFullscreenStage, setIsFullscreenStage] = useState<boolean>(false);
  const [showNotesPanel, setShowNotesPanel] = useState<boolean>(false);
  const [showCountEditor, setShowCountEditor] = useState<boolean>(false);
  const [draftCount, setDraftCount] = useState<string>(String(totalQuestions));
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [iframeReloadNonce, setIframeReloadNonce] = useState<number>(0);

  useEffect(() => {
    setIframeLoaded(false);
  }, [curriculum.id, questionNumber]);

  useEffect(() => {
    setDraftCount(String(totalQuestions));
  }, [totalQuestions]);

  // Keyboard Alt + Left/Right navigation between question pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isEn) {
          if (questionNumber > 1) onSelectQuestion(questionNumber - 1);
        } else {
          if (questionNumber < totalQuestions) onSelectQuestion(questionNumber + 1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isEn) {
          if (questionNumber < totalQuestions) onSelectQuestion(questionNumber + 1);
        } else {
          if (questionNumber > 1) onSelectQuestion(questionNumber - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEn, questionNumber, totalQuestions, onSelectQuestion]);

  const knownTitle = curriculum.knownQuestionTitles?.[questionNumber];
  const probeMeta = curriculumProbes[questionNumber];

  const displayQuestionTitle =
    activeQuestionData?.liveTitle ||
    probeMeta?.liveTitle ||
    (knownTitle ? (isEn ? knownTitle.en : knownTitle.ar) : undefined) ||
    (isEn
      ? `Exam Structure Question ${questionNumber} — Dedicated Interactive Page`
      : `صفحة السؤال الوزاري رقم ${questionNumber} — تدريبات الهيكل المحلولة`);

  const allNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const filteredSidebarNumbers = allNumbers.filter((n) => {
    if (sidebarFilter === 'live') return curriculumProbes[n]?.status === 'live';
    if (sidebarFilter === 'done') return completedQuestions.includes(n);
    if (sidebarFilter === 'saved') return bookmarkedQuestions.includes(n);
    return true;
  });

  const mcqNums = filteredSidebarNumbers.filter((n) => n <= curriculum.mcqQuestionsEnd);
  const paperNums = filteredSidebarNumbers.filter((n) => n > curriculum.mcqQuestionsEnd);
  const liveQuestionNumbers = allNumbers.filter((n) => curriculumProbes[n]?.status === 'live');

  const isChecking =
    !activeQuestionData ||
    activeQuestionData.status === 'checking' ||
    activeQuestionData.status === 'idle';
  const isLiveWithContent =
    activeQuestionData?.status === 'live' && Boolean(activeQuestionData?.html);

  const PrevChevron = isEn ? ChevronLeft : ChevronRight;
  const NextChevron = isEn ? ChevronRight : ChevronLeft;
  const BackArrow = isEn ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-4">
      {/* Contextual Hierarchy Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BackArrow className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span>{isEn ? 'All Curricula' : 'جميع المناهج'}</span>
          </button>

          {/* Year Select */}
          <select
            aria-label={isEn ? 'Select Year' : 'السنة الدراسية'}
            value="2026"
            onChange={(e) => {
              if (e.target.value === '2025') onSwitchTo2025();
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-amber-500 focus:outline-none tabular-nums cursor-pointer"
          >
            <option value="2026">{isEn ? '2026 Structures' : 'هياكل 2026'}</option>
            <option value="2025">{isEn ? '2025 Archive' : 'هياكل 2025'}</option>
          </select>

          {/* Term Select */}
          <select
            aria-label={isEn ? 'Select Term' : 'الفصل الدراسي'}
            value={selectedTerm}
            onChange={(e) => onTermChange(e.target.value as Eot2026TermId)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            {EOT2026_TERMS.map((t) => (
              <option key={t.id} value={t.id}>
                {isEn ? t.labelEn : t.labelAr}
              </option>
            ))}
          </select>

          {/* Subject / Curriculum Select */}
          <select
            aria-label={isEn ? 'Select Subject Structure' : 'اختر المنهج والمادة'}
            value={curriculum.id}
            onChange={(e) => onSelectCurriculum(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs font-extrabold text-slate-900 dark:text-amber-300 focus:border-amber-500 focus:outline-none max-w-[260px] truncate cursor-pointer"
          >
            {curriculaForSelection.map((c) => (
              <option key={c.id} value={c.id}>
                {isEn ? c.titleEn : c.titleAr}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            )}
            <span>{isEn ? 'Questions Index' : 'فهرس الأسئلة'}</span>
          </button>

          <button
            type="button"
            onClick={onScanEntireCurriculum}
            disabled={isScanningCurriculum}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningCurriculum ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Sync Questions' : 'فحص توفر الأسئلة'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Questions Index Sidebar */}
        {sidebarOpen && !isFullscreenStage && (
          <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 transition-colors">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {getGradeLabel2026(curriculum.grade, language)} ·{' '}
                {getStreamLabel2026(curriculum.stream, language)}
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isEn ? curriculum.titleEn : curriculum.titleAr}
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-[11px] font-bold">
              {(
                [
                  { id: 'all', ar: 'الكل', en: 'All' },
                  { id: 'live', ar: 'متاح', en: 'Live' },
                  { id: 'done', ar: 'مكتمل', en: 'Done' },
                  { id: 'saved', ar: 'محفوظ', en: 'Saved' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSidebarFilter(tab.id)}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    sidebarFilter === tab.id
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? tab.en : tab.ar}
                </button>
              ))}
            </div>

            {/* Question List */}
            <div className="space-y-3 max-h-[62vh] overflow-y-auto pr-1">
              {filteredSidebarNumbers.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
                  {isEn ? 'No questions match this filter.' : 'لا توجد أسئلة مطابقة لهذا الفلتر.'}
                </p>
              ) : (
                <>
                  {mcqNums.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 tabular-nums">
                        {isEn
                          ? `Part 1 · Multiple Choice (1 – ${curriculum.mcqQuestionsEnd})`
                          : `القسم الأول · الاختيار من متعدد (1 – ${curriculum.mcqQuestionsEnd})`}
                      </div>
                      <div className="space-y-1">
                        {mcqNums.map((qNum) => {
                          const active = qNum === questionNumber;
                          const done = completedQuestions.includes(qNum);
                          const saved = bookmarkedQuestions.includes(qNum);
                          const qProbe = curriculumProbes[qNum];
                          const qKnown = curriculum.knownQuestionTitles?.[qNum];

                          return (
                            <button
                              key={qNum}
                              type="button"
                              onClick={() => onSelectQuestion(qNum)}
                              className={`w-full text-start px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                active
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-xs'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-bold tabular-nums shrink-0">
                                  Q{String(qNum).padStart(2, '0')}
                                </span>
                                <span className="truncate">
                                  {qProbe?.liveTitle ||
                                    (qKnown ? (isEn ? qKnown.en : qKnown.ar) : undefined) ||
                                    (isEn ? `Question Page ${qNum}` : `صفحة السؤال ${qNum}`)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 text-[11px]">
                                {qProbe?.status === 'live' && !active && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    {isEn ? 'Live' : 'متاح'}
                                  </span>
                                )}
                                {saved && (
                                  <Bookmark
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950 fill-slate-950'
                                        : 'text-amber-500 fill-amber-500'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                                {done && (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {paperNums.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 tabular-nums">
                        {isEn
                          ? `Part 2 · Written / FRQ (${curriculum.mcqQuestionsEnd + 1} – ${totalQuestions})`
                          : `القسم الثاني · الأسئلة المقالية (${curriculum.mcqQuestionsEnd + 1} – ${totalQuestions})`}
                      </div>
                      <div className="space-y-1">
                        {paperNums.map((qNum) => {
                          const active = qNum === questionNumber;
                          const done = completedQuestions.includes(qNum);
                          const saved = bookmarkedQuestions.includes(qNum);
                          const qProbe = curriculumProbes[qNum];

                          return (
                            <button
                              key={qNum}
                              type="button"
                              onClick={() => onSelectQuestion(qNum)}
                              className={`w-full text-start px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                                active
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-xs'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono font-bold tabular-nums shrink-0">
                                  Q{String(qNum).padStart(2, '0')}
                                </span>
                                <span className="truncate">
                                  {qProbe?.liveTitle ||
                                    (isEn
                                      ? `Written Question ${qNum}`
                                      : `صفحة السؤال المقالي ${qNum}`)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 text-[11px]">
                                {qProbe?.status === 'live' && !active && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    {isEn ? 'Live' : 'متاح'}
                                  </span>
                                )}
                                {saved && (
                                  <Bookmark
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950 fill-slate-950'
                                        : 'text-amber-500 fill-amber-500'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                                {done && (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      active
                                        ? 'text-slate-950'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Adjust Total Question Pages inline */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCountEditor((v) => !v)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 py-1 cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Settings2 className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  <span>{isEn ? 'Configure Question Count' : 'ضبط عدد أسئلة الهيكل'}</span>
                </span>
                <span className="font-mono tabular-nums">{totalQuestions}</span>
              </button>
              {showCountEditor && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const parsed = Math.max(1, Math.min(60, Number(draftCount) || 25));
                    onUpdateTotalQuestions(curriculum.id, parsed);
                    setShowCountEditor(false);
                  }}
                  className="mt-2 flex items-center gap-2"
                >
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={draftCount}
                    onChange={(e) => setDraftCount(e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono tabular-nums focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Save' : 'حفظ العدد'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        )}

        {/* Dedicated Single-Question Page Stage */}
        <div
          className={`${
            sidebarOpen && !isFullscreenStage ? 'lg:col-span-9' : 'lg:col-span-12'
          } space-y-4`}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors shadow-xs">
            {/* Dedicated Page Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {isEn
                        ? `Question Page ${String(questionNumber).padStart(2, '0')} of ${totalQuestions}`
                        : `صفحة السؤال ${String(questionNumber).padStart(2, '0')} من ${totalQuestions}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {questionNumber <= curriculum.mcqQuestionsEnd
                        ? isEn
                          ? 'Multiple Choice (MCQ)'
                          : 'اختيار من متعدد (MCQ)'
                        : isEn
                        ? 'Written / Free Response (FRQ)'
                        : 'سؤال مقالي ورقي (FRQ)'}
                    </span>
                    {isLiveWithContent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isEn ? 'Available' : 'متاح للحل التفاعلي'}</span>
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {displayQuestionTitle}
                  </h2>
                </div>

                {/* Prev / Next Question Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={questionNumber <= 1}
                    onClick={() => onSelectQuestion(questionNumber - 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PrevChevron className="w-4 h-4" aria-hidden="true" />
                    <span>{isEn ? 'Previous' : 'السؤال السابق'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={questionNumber >= totalQuestions}
                    onClick={() => onSelectQuestion(questionNumber + 1)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-xs disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{isEn ? 'Next Question' : 'السؤال التالي'}</span>
                    <NextChevron className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Secondary Question Page Action Strip (100% Proprietary — No URLs or External Links) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleCompleted(questionNumber)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {isCompleted
                        ? isEn
                          ? 'Completed'
                          : 'تمت المراجعة'
                        : isEn
                        ? 'Mark Done'
                        : 'تحديد كمكتمل'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleBookmarked(questionNumber)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span>
                      {isBookmarked
                        ? isEn
                          ? 'Bookmarked'
                          : 'محفوظ للمراجعة'
                        : isEn
                        ? 'Bookmark'
                        : 'حفظ للمراجعة'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowNotesPanel((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      showNotesPanel || noteText.trim()
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isEn ? 'My Notes' : 'ملاحظات السؤال'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIframeLoaded(false);
                      setIframeReloadNonce((n) => n + 1);
                      onReloadQuestion(questionNumber);
                    }}
                    title={isEn ? 'Reload Question Page' : 'إعادة تحميل صفحة السؤال'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                    <span>{isEn ? 'Refresh Page' : 'تحديث السؤال'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullscreenStage((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-amber-500/20 dark:border dark:border-amber-500/40 text-amber-400 dark:text-amber-300 text-xs font-bold hover:bg-slate-800 dark:hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    {isFullscreenStage ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isEn ? 'Exit Fullscreen' : 'تصغير العرض'}</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isEn ? 'Fullscreen View' : 'وضع ملء الشاشة'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Personal Scratchpad Notes */}
              {showNotesPanel && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <label
                    htmlFor="eot2026-question-notes"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    {isEn
                      ? `Personal Study Notes — Question ${questionNumber}`
                      : `ملاحظاتي الخاصة على السؤال رقم ${questionNumber}`}
                  </label>
                  <textarea
                    id="eot2026-question-notes"
                    rows={3}
                    value={noteText}
                    onChange={(e) => onChangeNote(e.target.value)}
                    placeholder={
                      isEn
                        ? 'Write key formulas, steps, or reminders for this question...'
                        : 'اكتب القوانين المهمة أو خطوات الحل أو ملاحظاتك الخاصة على هذا السؤال...'
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Question Page Stage Body */}
            <div className="relative bg-slate-50 dark:bg-[#0a101d]">
              {isChecking ? (
                <div className="h-[68vh] min-h-[520px] flex items-center justify-center">
                  <OrbitalStructureLoader
                    variant="stage"
                    language={language}
                    label={
                      isEn
                        ? `Loading Question ${questionNumber} interactive page...`
                        : `جاري تحميل صفحة السؤال ${questionNumber}...`
                    }
                  />
                </div>
              ) : isLiveWithContent ? (
                <div className="relative w-full">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 bg-slate-50 dark:bg-[#0a101d] flex items-center justify-center pointer-events-none">
                      <OrbitalStructureLoader
                        variant="stage"
                        language={language}
                        label={
                          isEn
                            ? `Opening Question ${questionNumber}...`
                            : `جاري فتح صفحة السؤال ${questionNumber}...`
                        }
                      />
                    </div>
                  )}
                  <iframe
                    key={`${curriculum.id}-${questionNumber}-${iframeReloadNonce}`}
                    srcDoc={activeQuestionData?.html || ''}
                    title={displayQuestionTitle}
                    onLoad={() => setIframeLoaded(true)}
                    allow="clipboard-write; fullscreen"
                    className={`w-full border-0 bg-white ${
                      isFullscreenStage
                        ? 'h-[calc(100vh-190px)] min-h-[580px]'
                        : 'h-[76vh] min-h-[620px]'
                    }`}
                  />
                </div>
              ) : (
                /* Clean Official Pending View — Zero Repository or URL Mentions */
                <div className="min-h-[500px] p-6 sm:p-10 flex items-center justify-center">
                  <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center sm:text-start">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {isEn
                          ? `Question ${questionNumber} Page · Under Final Ministerial Audit`
                          : `صفحة السؤال ${questionNumber} · قيد الإعداد والتدقيق الوزاري`}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {isEn
                          ? `${curriculum.titleEn} — Question ${questionNumber}`
                          : `${curriculum.titleAr} — صفحة السؤال ${questionNumber}`}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isEn
                          ? 'This dedicated interactive question page will appear here automatically via live sync as soon as Mr. Mohammed Hesham publishes it.'
                          : 'هذه الصفحة التفاعلية مرتبطة بنظام التحديث الحي المباشر في المنصة، وستظهر هنا تلقائياً فور نشرها واعتمادها من قِبل Mr. Mohammed Hesham.'}
                      </p>
                    </div>

                    {liveQuestionNumbers.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {isEn
                            ? 'Available interactive question pages in this subject right now:'
                            : 'صفحات الأسئلة المتاحة للحل التفاعلي الآن في هذه المادة:'}
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                          {liveQuestionNumbers.map((lq) => (
                            <button
                              key={lq}
                              type="button"
                              onClick={() => onSelectQuestion(lq)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold tabular-nums hover:bg-amber-500/25 transition-colors cursor-pointer"
                            >
                              Q{lq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <button
                        type="button"
                        onClick={() => onReloadQuestion(questionNumber)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isEn ? 'Check Availability Now' : 'فحص التوفر وتحديث السؤال الآن'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={onBackToHub}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span>{isEn ? 'Browse Other Curricula' : 'استعراض مناهج أخرى'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Question Pages Pagination Strip */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
              <button
                type="button"
                disabled={questionNumber <= 1}
                onClick={() => onSelectQuestion(questionNumber - 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PrevChevron className="w-4 h-4" aria-hidden="true" />
                <span>{isEn ? 'Previous Page' : 'صفحة السؤال السابق'}</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1 px-1">
                {allNumbers.map((num) => {
                  const active = num === questionNumber;
                  const done = completedQuestions.includes(num);
                  const live = curriculumProbes[num]?.status === 'live';

                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onSelectQuestion(num)}
                      className={`min-w-[34px] h-8 px-2 rounded-lg text-xs font-mono font-bold tabular-nums transition-colors shrink-0 cursor-pointer border ${
                        active
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-slate-950'
                          : done
                          ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                          : live
                          ? 'bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      {String(num).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={questionNumber >= totalQuestions}
                onClick={() => onSelectQuestion(questionNumber + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{isEn ? 'Next Page' : 'صفحة السؤال التالي'}</span>
                <NextChevron className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
