import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Grid,
  LayoutGrid,
  MonitorPlay,
  RefreshCw,
} from 'lucide-react';
import {
  Eot2026AppView,
  Eot2026Curriculum,
  Eot2026GradeId,
  Eot2026StreamId,
  Eot2026SubjectId,
  Eot2026TermId,
  EotLanguage,
  EotQuestionProbeResult,
  EotStudentProgressStore,
} from '../types';
import {
  fetchLiveEot2026QuestionPage,
  getInitialEot2026Curricula,
  loadEot2026Progress,
  loadLocalQuestionCounts,
  probeLiveEot2026Batch,
  saveEot2026Progress,
  saveLocalQuestionCounts,
  syncLiveEot2026Curricula,
  updateSharedEot2026QuestionCount,
} from '../eot2026LiveService';
import { EotPlatformLogo } from './EotPlatformLogo';
import { CurriculaHub2026View } from './CurriculaHub2026View';
import { QuestionWorkspace2026View } from './QuestionWorkspace2026View';
import { StructuresMatrix2026View } from './StructuresMatrix2026View';

export interface Eot2026ExternalSyncFilters {
  term?: Eot2026TermId;
  grade?: string;
  stream?: string;
  subject?: string;
}

interface Eot2026PortalProps {
  language: EotLanguage;
  onSwitchTo2025: () => void;
  onSwitchToCurriculum?: () => void;
  externalFilters?: Eot2026ExternalSyncFilters;
  onExternalFilterChange?: (filters: Eot2026ExternalSyncFilters) => void;
}

export const Eot2026Portal: React.FC<Eot2026PortalProps> = ({
  language,
  onSwitchTo2025,
  onSwitchToCurriculum,
  externalFilters,
  onExternalFilterChange,
}) => {
  const isEn = language === 'en';

  const [curricula, setCurricula] = useState<Eot2026Curriculum[]>(() =>
    getInitialEot2026Curricula()
  );
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>(() =>
    loadLocalQuestionCounts()
  );
  const [progress, setProgress] = useState<EotStudentProgressStore>(() => loadEot2026Progress());

  const [activeView, setActiveView] = useState<Eot2026AppView>('hub');
  const [selectedTerm, setSelectedTerm] = useState<Eot2026TermId>(externalFilters?.term || 'T1');
  const [selectedGrade, setSelectedGrade] = useState<Eot2026GradeId | 'all'>('all');
  const [selectedStream, setSelectedStream] = useState<Eot2026StreamId | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<Eot2026SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeCurriculumId, setActiveCurriculumId] = useState<string>(
    progress.lastVisited?.curriculumId || '12-adv-bri-phy-t1-2026'
  );
  const [activeQuestionNumber, setActiveQuestionNumber] = useState<number>(
    progress.lastVisited?.questionNumber || 1
  );

  const [probeMap, setProbeMap] = useState<Record<string, Record<number, EotQuestionProbeResult>>>(
    {}
  );
  const [activeQuestionHtmlMap, setActiveQuestionHtmlMap] = useState<
    Record<string, EotQuestionProbeResult>
  >({});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isScanningCurriculum, setIsScanningCurriculum] = useState<boolean>(false);

  // Sync external SmartNavigatorBar filter changes into EOT 2026
  useEffect(() => {
    if (!externalFilters) return;
    if (externalFilters.term && externalFilters.term !== selectedTerm) {
      setSelectedTerm(externalFilters.term);
    }
    if (externalFilters.grade) {
      if (['12', '11', '10', '9'].includes(externalFilters.grade)) {
        setSelectedGrade(externalFilters.grade as Eot2026GradeId);
      }
    }
    if (externalFilters.subject) {
      if (['math', 'physics', 'chemistry', 'biology'].includes(externalFilters.subject)) {
        setSelectedSubject(externalFilters.subject as Eot2026SubjectId);
      }
    }
    if (externalFilters.stream) {
      if (['adv_bridge', 'adv_inspire', 'general'].includes(externalFilters.stream)) {
        setSelectedStream(externalFilters.stream as Eot2026StreamId);
      }
    }
  }, [
    externalFilters?.term,
    externalFilters?.grade,
    externalFilters?.subject,
    externalFilters?.stream,
  ]);

  // Persist progress & listen for cross-tab live updates
  useEffect(() => {
    saveEot2026Progress(progress);
  }, [progress]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mmh_eot_structures_progress_v1') {
        setProgress(loadEot2026Progress());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const getTotalQuestions = useCallback(
    (curriculum: Eot2026Curriculum): number => {
      return questionCounts[curriculum.id] || curriculum.defaultTotalQuestions || 25;
    },
    [questionCounts]
  );

  // Perform full live sync with Mr-Mohammed-Hesham/EOT + live question availability batch probe
  const runLiveSync = useCallback(
    async (forceRefresh = false, targetTerm: Eot2026TermId = selectedTerm) => {
      setIsSyncing(true);
      try {
        const { curricula: liveCurricula, sharedCounts } = await syncLiveEot2026Curricula(
          forceRefresh
        );
        if (liveCurricula.length > 0) {
          setCurricula(liveCurricula);
        }
        if (Object.keys(sharedCounts).length > 0) {
          setQuestionCounts((prev) => {
            const merged = { ...prev, ...sharedCounts };
            saveLocalQuestionCounts(merged);
            return merged;
          });
        }

        const termIds = (liveCurricula.length > 0 ? liveCurricula : curricula)
          .filter((c) => c.term === targetTerm)
          .map((c) => c.id);

        if (termIds.length > 0) {
          const batchProbes = await probeLiveEot2026Batch(termIds, 25, forceRefresh);
          setProbeMap((prev) => {
            const next = { ...prev };
            for (const [cid, qMap] of Object.entries(batchProbes)) {
              next[cid] = { ...(next[cid] || {}), ...qMap };
            }
            return next;
          });
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [curricula, selectedTerm]
  );

  // Initial live sync on mount + automatic periodic live sync every 90s
  useEffect(() => {
    runLiveSync(false, selectedTerm);
    const interval = window.setInterval(() => {
      runLiveSync(false, selectedTerm);
    }, 90000);
    return () => window.clearInterval(interval);
  }, [selectedTerm]);

  const curriculaForTerm = useMemo(
    () => curricula.filter((c) => c.term === selectedTerm),
    [curricula, selectedTerm]
  );

  const filteredCurricula = useMemo(() => {
    return curriculaForTerm.filter((c) => {
      if (selectedGrade !== 'all' && c.grade !== selectedGrade) return false;
      if (selectedStream !== 'all' && c.stream !== selectedStream) return false;
      if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${c.titleAr} ${c.titleEn} ${c.subtitleAr} ${c.subtitleEn}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [curriculaForTerm, selectedGrade, selectedStream, selectedSubject, searchQuery]);

  const activeCurriculum = useMemo(() => {
    return (
      curricula.find((c) => c.id === activeCurriculumId) ||
      curriculaForTerm[0] ||
      curricula[0]
    );
  }, [curricula, activeCurriculumId, curriculaForTerm]);

  // Fetch protected srcDoc HTML when viewing a question in Workspace
  const loadWorkspaceQuestion = useCallback(
    async (curriculumId: string, q: number, force = false) => {
      const key = `${curriculumId}__Q${q}`;
      setActiveQuestionHtmlMap((prev) => ({
        ...prev,
        [key]: force ? { status: 'checking' } : prev[key] || { status: 'checking' },
      }));

      const res = await fetchLiveEot2026QuestionPage(curriculumId, q, force);
      setActiveQuestionHtmlMap((prev) => ({
        ...prev,
        [key]: res,
      }));
      setProbeMap((prev) => ({
        ...prev,
        [curriculumId]: {
          ...(prev[curriculumId] || {}),
          [q]: {
            status: res.status,
            liveTitle: res.liveTitle,
            checkedAt: res.checkedAt,
          },
        },
      }));
    },
    []
  );

  useEffect(() => {
    if (activeView !== 'workspace' || !activeCurriculum) return;
    loadWorkspaceQuestion(activeCurriculum.id, activeQuestionNumber, false);
    const total = getTotalQuestions(activeCurriculum);
    if (activeQuestionNumber + 1 <= total) {
      // Prefetch next question quietly for instant next-page transition
      fetchLiveEot2026QuestionPage(activeCurriculum.id, activeQuestionNumber + 1, false).then(
        (res) => {
          setActiveQuestionHtmlMap((prev) => ({
            ...prev,
            [`${activeCurriculum.id}__Q${activeQuestionNumber + 1}`]: res,
          }));
        }
      );
    }
  }, [activeView, activeCurriculum, activeQuestionNumber, getTotalQuestions, loadWorkspaceQuestion]);

  const handleOpenCurriculumQuestion = (curriculumId: string, qNumber: number) => {
    const target = curricula.find((c) => c.id === curriculumId);
    if (target) {
      setSelectedTerm(target.term);
      onExternalFilterChange?.({
        term: target.term,
        grade: target.grade,
        stream: target.stream,
        subject: target.subject,
      });
    }
    setActiveCurriculumId(curriculumId);
    setActiveQuestionNumber(qNumber);
    setActiveView('workspace');
    setProgress((prev) => ({
      ...prev,
      lastVisited: { curriculumId, questionNumber: qNumber },
    }));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCurriculumInWorkspace = (curriculumId: string) => {
    setActiveCurriculumId(curriculumId);
    setActiveQuestionNumber(1);
    const target = curricula.find((c) => c.id === curriculumId);
    if (target) {
      onExternalFilterChange?.({
        term: target.term,
        grade: target.grade,
        stream: target.stream,
        subject: target.subject,
      });
    }
  };

  const handleTermChange = (term: Eot2026TermId) => {
    setSelectedTerm(term);
    onExternalFilterChange?.({ term });
    if (activeView === 'workspace' && activeCurriculum) {
      const matching = curricula.find(
        (c) =>
          c.term === term &&
          c.grade === activeCurriculum.grade &&
          c.stream === activeCurriculum.stream &&
          c.subject === activeCurriculum.subject
      );
      if (matching) {
        setActiveCurriculumId(matching.id);
        setActiveQuestionNumber(1);
      }
    }
  };

  const handleScanEntireActiveCurriculum = async () => {
    if (!activeCurriculum || isScanningCurriculum) return;
    setIsScanningCurriculum(true);
    try {
      const total = getTotalQuestions(activeCurriculum);
      const batch = await probeLiveEot2026Batch([activeCurriculum.id], total, true);
      if (batch[activeCurriculum.id]) {
        setProbeMap((prev) => ({
          ...prev,
          [activeCurriculum.id]: {
            ...(prev[activeCurriculum.id] || {}),
            ...batch[activeCurriculum.id],
          },
        }));
      }
      await loadWorkspaceQuestion(activeCurriculum.id, activeQuestionNumber, true);
    } finally {
      setIsScanningCurriculum(false);
    }
  };

  const handleToggleCompleted = (q: number) => {
    if (!activeCurriculum) return;
    const cid = activeCurriculum.id;
    setProgress((prev) => {
      const list = prev.completed[cid] || [];
      const next = list.includes(q) ? list.filter((x) => x !== q) : [...list, q];
      return {
        ...prev,
        completed: { ...prev.completed, [cid]: next },
      };
    });
  };

  const handleToggleBookmarked = (q: number) => {
    if (!activeCurriculum) return;
    const cid = activeCurriculum.id;
    setProgress((prev) => {
      const list = prev.bookmarked[cid] || [];
      const next = list.includes(q) ? list.filter((x) => x !== q) : [...list, q];
      return {
        ...prev,
        bookmarked: { ...prev.bookmarked, [cid]: next },
      };
    });
  };

  const handleChangeNote = (text: string) => {
    if (!activeCurriculum) return;
    const key = `${activeCurriculum.id}__Q${activeQuestionNumber}`;
    setProgress((prev) => ({
      ...prev,
      notes: { ...prev.notes, [key]: text },
    }));
  };

  const handleUpdateTotalQuestions = (curriculumId: string, count: number) => {
    setQuestionCounts((prev) => ({ ...prev, [curriculumId]: count }));
    if (activeQuestionNumber > count) {
      setActiveQuestionNumber(count);
    }
    updateSharedEot2026QuestionCount(curriculumId, count);
  };

  const handleResetFilters = () => {
    setSelectedTerm('T1');
    setSelectedGrade('all');
    setSelectedStream('all');
    setSelectedSubject('all');
    setSearchQuery('');
    onExternalFilterChange?.({
      term: 'T1',
      grade: 'all',
      stream: 'all',
      subject: 'all',
    });
  };

  const activeTotalQ = activeCurriculum ? getTotalQuestions(activeCurriculum) : 25;
  const activeCompletedList = activeCurriculum ? progress.completed[activeCurriculum.id] || [] : [];
  const activeBookmarkedList = activeCurriculum
    ? progress.bookmarked[activeCurriculum.id] || []
    : [];
  const activeNote = activeCurriculum
    ? progress.notes[`${activeCurriculum.id}__Q${activeQuestionNumber}`] || ''
    : '';
  const activeQuestionData = activeCurriculum
    ? activeQuestionHtmlMap[`${activeCurriculum.id}__Q${activeQuestionNumber}`]
    : undefined;

  return (
    <div className="space-y-6">
      {/* Unified Sub-Header Bar for EOT 2026 Portal */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <EotPlatformLogo className="w-8 h-8 shrink-0" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
              <span className="text-amber-500">Mr. Mohammed Hesham</span>{' '}
              <span>{isEn ? '· EOT 2026' : '· بوابة هياكل 2026'}</span>
            </span>
          </div>
        </div>

        {/* Navigation Views Tabs */}
        <nav
          aria-label={isEn ? 'EOT 2026 Views' : 'أقسام هياكل 2026'}
          className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl"
        >
          <button
            type="button"
            onClick={() => setActiveView('hub')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeView === 'hub'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Curricula Hub' : 'بوابة الهياكل'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('workspace')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeView === 'workspace'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Question Pages' : 'مساحة الأسئلة التفاعلية'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('matrix')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeView === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isEn ? 'Structures Matrix' : 'مصفوفة الهياكل'}</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => runLiveSync(true, selectedTerm)}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isEn ? 'Sync Now' : 'تحديث المنصة'}</span>
          </button>

          {onSwitchToCurriculum && (
            <button
              type="button"
              onClick={onSwitchToCurriculum}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Curricula & Lessons' : 'قسم المناهج والدروس'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active View Content */}
      {activeView === 'hub' && (
        <CurriculaHub2026View
          curricula={filteredCurricula}
          allCurriculaForTerm={curriculaForTerm}
          onSwitchTo2025={onSwitchTo2025}
          selectedTerm={selectedTerm}
          onTermChange={handleTermChange}
          selectedGrade={selectedGrade}
          onGradeChange={(g) => {
            setSelectedGrade(g);
            onExternalFilterChange?.({ grade: g });
          }}
          selectedStream={selectedStream}
          onStreamChange={(st) => {
            setSelectedStream(st);
            onExternalFilterChange?.({ stream: st });
          }}
          selectedSubject={selectedSubject}
          onSubjectChange={(sub) => {
            setSelectedSubject(sub);
            onExternalFilterChange?.({ subject: sub });
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetFilters={handleResetFilters}
          onOpenCurriculumQuestion={handleOpenCurriculumQuestion}
          getTotalQuestions={getTotalQuestions}
          completedMap={progress.completed}
          probeMap={probeMap}
          isSyncing={isSyncing}
          onManualSync={() => runLiveSync(true, selectedTerm)}
          language={language}
        />
      )}

      {activeView === 'workspace' && activeCurriculum && (
        <QuestionWorkspace2026View
          curriculum={activeCurriculum}
          curriculaForSelection={curriculaForTerm.length > 0 ? curriculaForTerm : curricula}
          onSwitchTo2025={onSwitchTo2025}
          selectedTerm={selectedTerm}
          onTermChange={handleTermChange}
          onSelectCurriculum={handleSelectCurriculumInWorkspace}
          questionNumber={activeQuestionNumber}
          totalQuestions={activeTotalQ}
          onSelectQuestion={setActiveQuestionNumber}
          onUpdateTotalQuestions={handleUpdateTotalQuestions}
          activeQuestionData={activeQuestionData}
          curriculumProbes={probeMap[activeCurriculum.id] || {}}
          isScanningCurriculum={isScanningCurriculum}
          onReloadQuestion={(q) => loadWorkspaceQuestion(activeCurriculum.id, q, true)}
          onScanEntireCurriculum={handleScanEntireActiveCurriculum}
          isCompleted={activeCompletedList.includes(activeQuestionNumber)}
          completedQuestions={activeCompletedList}
          onToggleCompleted={handleToggleCompleted}
          isBookmarked={activeBookmarkedList.includes(activeQuestionNumber)}
          bookmarkedQuestions={activeBookmarkedList}
          onToggleBookmarked={handleToggleBookmarked}
          noteText={activeNote}
          onChangeNote={handleChangeNote}
          onBackToHub={() => setActiveView('hub')}
          language={language}
        />
      )}

      {activeView === 'matrix' && (
        <StructuresMatrix2026View
          curricula={curriculaForTerm}
          onSwitchTo2025={onSwitchTo2025}
          selectedTerm={selectedTerm}
          onTermChange={handleTermChange}
          getTotalQuestions={getTotalQuestions}
          completedMap={progress.completed}
          probeMap={probeMap}
          isScanningAll={isSyncing}
          onScanAllCurricula={() => runLiveSync(true, selectedTerm)}
          onOpenCurriculumQuestion={handleOpenCurriculumQuestion}
          language={language}
        />
      )}
    </div>
  );
};
