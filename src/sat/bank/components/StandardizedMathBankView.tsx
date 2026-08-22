import React, { useState, useMemo } from 'react';
import { allExams } from '../data/examsData';
import { allDiagnosticTests, diagnosticDomains } from '../data/diagnosticTestsData';
import { QuestionItem, TestExam, QuestionCategory } from '../types';
import { QuestionCard } from './QuestionCard';
import { DiagnosticSection } from './DiagnosticSection';
import { DesmosSimulator } from './DesmosSimulator';
import { PracticeQuizModal } from './PracticeQuizModal';
import { translations, Language } from '../data/translations';
import {
  GraduationCap,
  FileSpreadsheet,
  Calculator,
  Award,
  Search,
  BookOpen,
  Bookmark,
  Sparkles,
  Layers,
  CheckCircle2,
  Filter,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Globe,
} from 'lucide-react';

interface StandardizedMathBankViewProps {
  language?: Language;
  onLanguageToggle?: () => void;
}

export const StandardizedMathBankView: React.FC<StandardizedMathBankViewProps> = ({
  language = 'ar',
  onLanguageToggle,
}) => {
  const t = translations[language];
  const [activeSubTab, setActiveSubTab] = useState<'diagnostic' | 'full-exams'>('diagnostic');
  const [selectedExamId, setSelectedExamId] = useState<string>('exam-1-dec-2024');
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Filter state for full exams
  const [filterModule, setFilterModule] = useState<'all' | 1 | 2>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<'all' | 'MCQ' | 'SPR'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Bookmarks State in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('dsat_bank_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('dsat_bank_bookmarks', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  // Current active exam object
  const currentExam = useMemo(() => {
    return allExams.find((e) => e.id === selectedExamId) || allExams[0];
  }, [selectedExamId]);

  // Filtered questions in active exam
  const filteredQuestions = useMemo(() => {
    return currentExam.questions.filter((q) => {
      // Module filter
      if (filterModule !== 'all' && q.module !== filterModule) {
        return false;
      }
      // Category filter
      if (filterCategory !== 'all' && q.category !== filterCategory) {
        return false;
      }
      // Format filter (MCQ / SPR)
      if (filterFormat !== 'all' && q.format !== filterFormat) {
        return false;
      }
      // Difficulty filter
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) {
        return false;
      }
      // Bookmarked filter
      if (onlyBookmarked && !bookmarkedIds.has(q.id)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchText = q.questionText.toLowerCase().includes(query);
        const matchTextAr = q.questionTextAr?.toLowerCase().includes(query);
        const matchCategory = q.category.toLowerCase().includes(query) || q.categoryAr.toLowerCase().includes(query);
        const matchEq = q.equation?.toLowerCase().includes(query);
        const matchDesmos = q.explanation.desmosTip?.toLowerCase().includes(query);
        return matchText || matchTextAr || matchCategory || matchEq || matchDesmos;
      }
      return true;
    });
  }, [
    currentExam,
    filterModule,
    filterCategory,
    filterFormat,
    filterDifficulty,
    onlyBookmarked,
    bookmarkedIds,
    searchQuery,
  ]);

  const categories: { key: string; labelEn: string; labelAr: string }[] = [
    { key: 'all', labelEn: 'All Topics', labelAr: 'كل الموضوعات' },
    { key: 'Algebra', labelEn: 'Algebra', labelAr: 'الجبر الخطي' },
    { key: 'Advanced Math', labelEn: 'Advanced Math', labelAr: 'الرياضيات المتقدمة' },
    {
      key: 'Problem-Solving and Data Analysis',
      labelEn: 'Data Analysis',
      labelAr: 'تحليل البيانات والإحصاء',
    },
    {
      key: 'Geometry and Trigonometry',
      labelEn: 'Geometry & Trig',
      labelAr: 'الهندسة وحساب المثلثات',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation & Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 shadow-sm">
        {/* Main Sub Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('diagnostic')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'diagnostic'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{language === 'ar' ? 'الاختبارات المعيارية (25 اختباراً تشخيصياً)' : 'Diagnostic Standards (25)'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('full-exams')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'full-exams'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{language === 'ar' ? 'بنك الامتحانات الكاملة (3 امتحانات - 132 سؤالاً)' : 'Full Exams Bank (3 Exams)'}</span>
          </button>
        </div>

        {/* Action Tools: Quiz Simulator & Desmos Grapher */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeSubTab === 'full-exams' && (
            <button
              onClick={() => setIsQuizOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-indigo-400" />
              <span>{language === 'ar' ? 'محاكي الامتحان المؤقت' : 'Timed Quiz Simulator'}</span>
            </button>
          )}

          <button
            onClick={() => setIsDesmosOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition-colors shadow-sm cursor-pointer"
            title="Desmos Grapher & Calculator"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'حاسبة ديسموس الرسومية' : 'Desmos Grapher'}</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      {activeSubTab === 'diagnostic' ? (
        <DiagnosticSection
          language={language}
          onOpenDesmos={() => setIsDesmosOpen(true)}
        />
      ) : (
        /* Full Exams Bank View */
        <div className="space-y-6">
          {/* Exam Selector Cards */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">
                  {language === 'ar' ? 'اختر الامتحان التدريبي للدراسة والحل الشامل:' : 'Select Practice Exam for Study & Training:'}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {language === 'ar' ? 'الامتحان النشط حالياً:' : 'Active Exam:'}{' '}
                <strong className="text-indigo-300 font-bold">
                  {language === 'ar' ? currentExam.titleAr : currentExam.title}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {allExams.map((exam, idx) => {
                const isSelected = selectedExamId === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setFilterModule('all');
                    }}
                    className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {language === 'ar' ? exam.titleAr : exam.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {language === 'ar' ? exam.title : exam.titleAr}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          exam.difficulty === 'Advanced'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {exam.difficulty === 'Advanced' ? '700+ Advanced' : 'Standard'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {language === 'ar' ? exam.descriptionAr : exam.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/60">
                      <span className="font-mono text-[11px]">
                        {exam.totalQuestions} {language === 'ar' ? 'سؤالاً (وحدتان)' : 'questions (2 modules)'}
                      </span>
                      <span className="text-indigo-400 font-semibold text-xs">
                        {isSelected ? '✓ تم التحديد' : 'انقر للعرض'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtering & Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث في أسئلة الامتحان (مثال: parabola, circle, triangle, bacteria)...' : 'Search questions in this exam...'}
                  className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Module Buttons */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setFilterModule('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterModule === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? 'كل الأسئلة (44)' : 'All Modules (44)'}
                </button>
                <button
                  onClick={() => setFilterModule(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterModule === 1
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? 'الوحدة 1 (22)' : 'Module 1 (22)'}
                </button>
                <button
                  onClick={() => setFilterModule(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterModule === 2
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {language === 'ar' ? 'الوحدة 2 (22)' : 'Module 2 (22)'}
                </button>
              </div>

              {/* Bookmark Filter Toggle */}
              <button
                onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  onlyBookmarked
                    ? 'bg-amber-950 text-amber-300 border-amber-600'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400' : ''}`} />
                <span>
                  {language === 'ar' ? 'المحفوظات' : 'Bookmarked'} ({bookmarkedIds.size})
                </span>
              </button>
            </div>

            {/* Sub-Filters: Topics, Format, Difficulty */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isSelected = filterCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setFilterCategory(cat.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-slate-700 text-white font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {language === 'ar' ? cat.labelAr : cat.labelEn}
                    </button>
                  );
                })}
              </div>

              {/* Format Filter (MCQ / SPR) */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
                <button
                  onClick={() => setFilterFormat('all')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    filterFormat === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {language === 'ar' ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setFilterFormat('MCQ')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    filterFormat === 'MCQ' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  MCQ
                </button>
                <button
                  onClick={() => setFilterFormat('SPR')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    filterFormat === 'SPR' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Grid-in (SPR)
                </button>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
                {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      filterDifficulty === diff ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    {diff === 'all'
                      ? language === 'ar'
                        ? 'كل المستويات'
                        : 'All Levels'
                      : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List Render */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'ar'
                  ? `عرض ${filteredQuestions.length} من أصل ${currentExam.questions.length} سؤالاً`
                  : `Showing ${filteredQuestions.length} of ${currentExam.questions.length} questions`}
              </span>

              {(filterModule !== 'all' ||
                filterCategory !== 'all' ||
                filterFormat !== 'all' ||
                filterDifficulty !== 'all' ||
                searchQuery ||
                onlyBookmarked) && (
                <button
                  onClick={() => {
                    setFilterModule('all');
                    setFilterCategory('all');
                    setFilterFormat('all');
                    setFilterDifficulty('all');
                    setSearchQuery('');
                    setOnlyBookmarked(false);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset filters'}</span>
                </button>
              )}
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">
                  {language === 'ar' ? 'لا توجد أسئلة تطابق معايير البحث الحالية' : 'No matching questions found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {language === 'ar' ? 'جرب تعديل كلمات البحث أو إلغاء بعض الفلاتر' : 'Try clearing your search terms or filters.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    viewMode="study"
                    isBookmarked={bookmarkedIds.has(q.id)}
                    onToggleBookmark={toggleBookmark}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desmos Simulator Floating Modal */}
      {isDesmosOpen && (
        <DesmosSimulator isOpen={isDesmosOpen} onClose={() => setIsDesmosOpen(false)} />
      )}

      {/* Quiz Modal */}
      {isQuizOpen && (
        <PracticeQuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          questions={currentExam.questions}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
          language={language}
        />
      )}
    </div>
  );
};
