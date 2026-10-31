import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Calculator,
  CheckCircle2,
  FlaskConical,
  Dna,
  RotateCcw,
  Search,
  RefreshCw,
} from 'lucide-react';
import {
  Eot2026Curriculum,
  Eot2026GradeId,
  Eot2026StreamId,
  Eot2026SubjectId,
  Eot2026TermId,
  EotLanguage,
  EotQuestionProbeResult,
} from '../types';
import {
  EOT2026_GRADES,
  EOT2026_STREAMS,
  EOT2026_SUBJECTS,
  EOT2026_TERMS,
  getGradeLabel2026,
  getStreamLabel2026,
  getSubjectLabel2026,
  getTermLabel2026,
} from '../eot2026LiveService';
import { EotPlatformLogo } from './EotPlatformLogo';
import { OrbitalStructureLoader } from './OrbitalStructureLoader';

interface CurriculaHub2026ViewProps {
  curricula: Eot2026Curriculum[];
  allCurriculaForTerm: Eot2026Curriculum[];
  onSwitchTo2025: () => void;
  selectedTerm: Eot2026TermId;
  onTermChange: (term: Eot2026TermId) => void;
  selectedGrade: Eot2026GradeId | 'all';
  onGradeChange: (grade: Eot2026GradeId | 'all') => void;
  selectedStream: Eot2026StreamId | 'all';
  onStreamChange: (stream: Eot2026StreamId | 'all') => void;
  selectedSubject: Eot2026SubjectId | 'all';
  onSubjectChange: (subject: Eot2026SubjectId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  onOpenCurriculumQuestion: (curriculumId: string, qNumber: number) => void;
  getTotalQuestions: (curriculum: Eot2026Curriculum) => number;
  completedMap: Record<string, number[]>;
  probeMap: Record<string, Record<number, EotQuestionProbeResult>>;
  isSyncing: boolean;
  onManualSync: () => void;
  language: EotLanguage;
}

export const CurriculaHub2026View: React.FC<CurriculaHub2026ViewProps> = ({
  curricula,
  allCurriculaForTerm,
  onSwitchTo2025,
  selectedTerm,
  onTermChange,
  selectedGrade,
  onGradeChange,
  selectedStream,
  onStreamChange,
  selectedSubject,
  onSubjectChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
  onOpenCurriculumQuestion,
  getTotalQuestions,
  completedMap,
  probeMap,
  isSyncing,
  onManualSync,
  language,
}) => {
  const isEn = language === 'en';
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  const totalCompletedAcrossFiltered = curricula.reduce((sum, curr) => {
    const done = (completedMap[curr.id] || []).filter((q) => q <= getTotalQuestions(curr)).length;
    return sum + done;
  }, 0);

  const totalLiveAcrossFiltered = curricula.reduce((sum, curr) => {
    const probes = Object.values(probeMap[curr.id] || {}) as EotQuestionProbeResult[];
    const live = probes.filter((p) => p.status === 'live').length;
    return sum + live;
  }, 0);

  // Dynamically include any newly discovered grades or subjects from live sync
  const dynamicGrades = React.useMemo(() => {
    const baseIds = new Set<string>(EOT2026_GRADES.map((g) => g.id));
    const extras = Array.from(new Set<string>(allCurriculaForTerm.map((c) => c.grade)))
      .filter((g) => !baseIds.has(g))
      .map((g) => ({ id: g, labelAr: `الصف ${g}`, labelEn: `Grade ${g}` }));
    return [...EOT2026_GRADES, ...extras];
  }, [allCurriculaForTerm]);

  const dynamicSubjects = React.useMemo(() => {
    const baseIds = new Set<string>(EOT2026_SUBJECTS.map((s) => s.id));
    const extras = Array.from(new Set<string>(allCurriculaForTerm.map((c) => c.subject)))
      .filter((s) => !baseIds.has(s))
      .map((s) => ({
        id: s,
        labelAr: getSubjectLabel2026(s, 'ar'),
        labelEn: getSubjectLabel2026(s, 'en'),
      }));
    return [...EOT2026_SUBJECTS, ...extras];
  }, [allCurriculaForTerm]);

  const getSubjectIcon = (subject: string) => {
    if (subject === 'physics') return Atom;
    if (subject === 'chemistry') return FlaskConical;
    if (subject === 'biology') return Dna;
    return Calculator;
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Split Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-[#0f172a] border border-amber-400/35 dark:border-amber-500/25 flex items-center justify-center p-1.5 shadow-sm shrink-0">
                    <EotPlatformLogo className="w-full h-full" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-extrabold text-amber-600 dark:text-amber-400">
                        Mr. Mohammed Hesham
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                        {isEn ? 'Academic Year 2026' : 'هياكل عام 2026 المعتمدة'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn
                        ? 'Official Exam Structures & Interactive Question Pages'
                        : 'منصة الهياكل الامتحانية الرسمية المقسمة حسب الأسئلة'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isEn ? 'Live Sync' : 'تحديث ومزامنة حية'}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-2xl">
                {isEn
                  ? 'Ministry EOT 2026 Exam Structures — Question by Question'
                  : 'منصة الهياكل الوزارية المعتمدة 2026 — كل سؤال في صفحة مستقلة'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {isEn
                  ? 'Organized systematically by Term, Grade, Stream, and Subject. Each curriculum is divided into dedicated interactive question pages for focused practice and mastery.'
                  : 'مقسمة بشكل منهجي منظم حسب الفصل الدراسي والصف والمسار والمادة، بحيث تنقسم المادة الواحدة إلى صفحات مستقلة لكل سؤال وزاري مع التدريب التفاعلي المباشر.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenCurriculumQuestion('12-adv-bri-phy-t1-2026', 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {isEn
                      ? 'Start 12 Adv Physics (Bridge) · Q1'
                      : 'ابدأ فيزياء 12 متقدم بريدج · السؤال 1'}
                  </span>
                  <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCurriculumQuestion('12-adv-bri-math-t1-2026', 1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {isEn
                      ? 'Start 12 Adv Math (Bridge) · Q1'
                      : 'رياضيات 12 متقدم بريدج · السؤال 1'}
                  </span>
                </button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums flex flex-wrap items-center gap-1.5">
                <span>
                  {isEn
                    ? `${curricula.length} active curricula`
                    : `${curricula.length} مناهج متاحة`}
                </span>
                {totalLiveAcrossFiltered > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {isEn
                        ? `${totalLiveAcrossFiltered} live pages`
                        : `${totalLiveAcrossFiltered} صفحة سؤال منشورة`}
                    </span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>
                  {isEn
                    ? `${totalCompletedAcrossFiltered} reviewed`
                    : `تمت مراجعة ${totalCompletedAcrossFiltered} سؤال`}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <OrbitalStructureLoader
              variant="hero"
              year="2026"
              language={language}
              isSyncing={isSyncing}
            />
          </div>
        </div>
      </section>

      {/* Hierarchy Filter Navigator */}
      <section
        aria-label={isEn ? 'Curriculum Hierarchy Filters' : 'تصفية الهياكل حسب السنة والفصل والمادة'}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Academic Year Branch Switcher (2026 <-> 2025) */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn ? 'Academic Year Branch' : 'السنة الدراسية للهيكل'}
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
              <button
                type="button"
                className="py-2 px-3 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs cursor-default tabular-nums"
              >
                {isEn ? '2026 Structures' : 'هياكل 2026 (الحالية)'}
              </button>
              <button
                type="button"
                onClick={onSwitchTo2025}
                className="py-2 px-3 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer tabular-nums"
              >
                {isEn ? '2025 Archive' : 'هياكل 2025 (الأرشيف)'}
              </button>
            </div>
          </div>

          {/* Term Segmented Control */}
          <div className="lg:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              {isEn ? 'Academic Term' : 'الفصل الدراسي'}
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
              {EOT2026_TERMS.map((t) => {
                const active = selectedTerm === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onTermChange(t.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.id === 'T1'
                      ? isEn
                        ? 'Term 1'
                        : 'الفصل الأول'
                      : t.id === 'T2'
                      ? isEn
                        ? 'Term 2'
                        : 'الفصل الثاني'
                      : isEn
                      ? 'Term 3'
                      : 'الفصل الثالث'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="lg:col-span-3 space-y-1.5">
            <label
              htmlFor="eot2026-curriculum-search"
              className="block text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              {isEn ? 'Quick Search' : 'بحث في المناهج'}
            </label>
            <div className="relative">
              <Search
                className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                  isEn ? 'left-3' : 'right-3'
                }`}
                aria-hidden="true"
              />
              <input
                id="eot2026-curriculum-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isEn ? 'Physics, Math, 12...' : 'فيزياء، رياضيات، 12...'}
                className={`w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none ${
                  isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Grade + Subject + Stream + Reset */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Grade Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isEn ? 'Grade:' : 'الصف:'}
              </span>
              <button
                type="button"
                onClick={() => onGradeChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedGrade === 'all'
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isEn ? 'All' : 'الكل'}
              </button>
              {dynamicGrades.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onGradeChange(g.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                    selectedGrade === g.id
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {g.id}
                </button>
              ))}
            </div>

            {/* Subject Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isEn ? 'Subject:' : 'المادة:'}
              </span>
              <button
                type="button"
                onClick={() => onSubjectChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedSubject === 'all'
                    ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/35'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isEn ? 'All' : 'الكل'}
              </button>
              {dynamicSubjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSubjectChange(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedSubject === s.id
                      ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/35'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isEn ? s.labelEn : s.labelAr}
                </button>
              ))}
            </div>

            {/* Stream Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isEn ? 'Stream:' : 'المسار:'}
              </span>
              <button
                type="button"
                onClick={() => onStreamChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedStream === 'all'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isEn ? 'All' : 'الكل'}
              </button>
              {EOT2026_STREAMS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onStreamChange(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedStream === st.id
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isEn ? st.labelEn : st.labelAr}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Reset Filters' : 'إعادة الضبط'}</span>
          </button>
        </div>
      </section>

      {/* Curricula Cards Grid */}
      {curricula.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {isEn
              ? 'No curricula match the current filter selection.'
              : 'لا توجد مناهج مطابقة لخيارات التصفية المحددة حالياً.'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {isEn
              ? 'Reset the filters to view all approved 2026 curricula.'
              : 'اضغط على زر إعادة الضبط لعرض جميع مناهج هياكل 2026 المعتمدة.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
            >
              {isEn ? 'Show All Curricula' : 'عرض جميع المناهج'}
            </button>
          </div>
        </div>
      ) : (
        <section
          aria-label={isEn ? 'Available Subject Structures' : 'قائمة مناهج الهياكل'}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {curricula.map((curriculum) => {
            const totalQ = getTotalQuestions(curriculum);
            const completedList = completedMap[curriculum.id] || [];
            const completedCount = completedList.filter((q) => q <= totalQ).length;
            const progressPct = totalQ > 0 ? Math.round((completedCount / totalQ) * 100) : 0;
            const curriculumProbes = probeMap[curriculum.id] || {};
            const liveCount = (Object.values(curriculumProbes) as EotQuestionProbeResult[]).filter(
              (p) => p.status === 'live'
            ).length;
            const SubjectIcon = getSubjectIcon(curriculum.subject);
            const previewNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n <= totalQ);

            return (
              <article
                key={curriculum.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-amber-500/45 dark:hover:border-amber-500/45 transition-colors shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span>{getGradeLabel2026(curriculum.grade, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getStreamLabel2026(curriculum.stream, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{getTermLabel2026(curriculum.term, language)}</span>
                    </div>
                    <SubjectIcon className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {isEn ? curriculum.titleEn : curriculum.titleAr}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? curriculum.subtitleEn : curriculum.subtitleAr}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {getSubjectLabel2026(curriculum.subject, language)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {isEn ? `${totalQ} Question Pages` : `${totalQ} صفحة سؤال`}
                    </span>
                    {liveCount > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {isEn ? `${liveCount} Available` : `${liveCount} متاح الآن`}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>
                      {isEn ? 'Jump directly to question page:' : 'انتقال سريع لصفحة السؤال:'}
                    </span>
                    <span>
                      {completedCount} / {totalQ} ({progressPct}%)
                    </span>
                  </div>

                  <progress
                    value={completedCount}
                    max={totalQ}
                    className="w-full h-1.5 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-slate-100 dark:[&::-webkit-progress-bar]:bg-slate-800 [&::-webkit-progress-value]:bg-amber-500 [&::-moz-progress-bar]:bg-amber-500"
                  />

                  <div className="grid grid-cols-5 gap-1.5">
                    {previewNumbers.map((qNum) => {
                      const isDone = completedList.includes(qNum);
                      const qProbe = curriculumProbes[qNum];
                      const isLive = qProbe?.status === 'live';

                      return (
                        <button
                          key={qNum}
                          type="button"
                          onClick={() => onOpenCurriculumQuestion(curriculum.id, qNum)}
                          title={
                            isEn
                              ? `Open Question ${qNum} Page`
                              : `فتح صفحة السؤال ${qNum}`
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold tabular-nums transition-colors cursor-pointer border ${
                            isDone
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                              : isLive
                              ? 'bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
                          }`}
                        >
                          Q{qNum}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {isEn
                        ? `${curriculum.mcqQuestionsEnd} MCQ · ${Math.max(0, totalQ - curriculum.mcqQuestionsEnd)} Written`
                        : `${curriculum.mcqQuestionsEnd} موضوعي · ${Math.max(0, totalQ - curriculum.mcqQuestionsEnd)} مقالي`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenCurriculumQuestion(curriculum.id, 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{isEn ? 'Open Question Pages' : 'فتح صفحات الأسئلة'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};
