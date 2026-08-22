import React, { useState, useMemo } from 'react';
import {
  allDiagnosticTests,
  diagnosticDomains,
  DiagnosticTest,
} from '../data/diagnosticTestsData';
import { translations, Language } from '../data/translations';
import {
  Search,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Calculator,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface DiagnosticSectionProps {
  language?: Language;
  onOpenDesmos: () => void;
}

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({ 
  language = 'ar',
  onOpenDesmos 
}) => {
  const t = translations[language];
  const isRTL = language === 'ar';
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTest, setActiveTest] = useState<DiagnosticTest | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);

  // Filtered diagnostic tests
  const filteredTests = useMemo(() => {
    return allDiagnosticTests.filter((test) => {
      // Domain filter
      if (selectedDomain !== 'all' && test.domainId !== selectedDomain) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = test.code.toLowerCase().includes(q) || test.repoId.toLowerCase().includes(q);
        const matchTitle = test.title.toLowerCase().includes(q) || test.titleAr.toLowerCase().includes(q);
        const matchDesc = test.descriptionAr.toLowerCase().includes(q) || test.description.toLowerCase().includes(q);
        const matchTopic = test.topics.some((topic) => topic.toLowerCase().includes(q));
        return matchCode || matchTitle || matchDesc || matchTopic;
      }
      return true;
    });
  }, [selectedDomain, searchQuery]);

  const handleStartTest = (test: DiagnosticTest) => {
    setActiveTest(test);
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
    // Scroll smoothly to top of active test area
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleReloadIframe = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCloseActiveTest = () => {
    setActiveTest(null);
    setIsFullscreen(false);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* If an active test is chosen, show embedded in-page test runner */}
      {activeTest ? (
        <div
          className={`rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 rounded-none border-0 h-screen'
              : 'min-h-[750px] h-[85vh]'
          }`}
        >
          {/* Top Control Navigation Bar for Active Test */}
          <div className="px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseActiveTest}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 cursor-pointer"
              >
                <BackIcon className="w-4 h-4 text-indigo-400" />
                <span>{t.diagBackBtn}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 font-mono font-bold text-xs border border-indigo-700/60">
                  {t.diagUnitPrefix} {activeTest.code}
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{language === 'ar' ? activeTest.titleAr : activeTest.title}</span>
                    <span className="text-xs font-normal text-slate-400 hidden md:inline">
                      ({language === 'ar' ? activeTest.title : activeTest.titleAr})
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-indigo-400 font-medium">
                      {language === 'ar' ? activeTest.domainNameAr : activeTest.domainName}
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeTest.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDesmos}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition-colors shadow-sm cursor-pointer"
                title={t.diagDesmosHelperBtn}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t.btnDesmos}</span>
              </button>

              <button
                onClick={handleReloadIframe}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700 cursor-pointer"
                title={t.diagReloadBtn}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700 cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : t.diagFullscreenBtn}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Embedded Test Iframe Container */}
          <div className="flex-1 relative bg-slate-950">
            {isLoadingIframe && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-200">{t.diagLoadingTest}</p>
                  <p className="text-xs text-slate-400 font-mono" dir="ltr">
                    {activeTest.url}
                  </p>
                </div>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={activeTest.url}
              title={`SAT Diagnostic Test - ${activeTest.title}`}
              className="w-full h-full border-0 bg-white"
              allow="clipboard-write; clipboard-read; fullscreen"
              onLoad={() => setIsLoadingIframe(false)}
            />
          </div>

          {/* Embedded Footer */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {t.diagEmbeddedNotice} &bull; {t.diagAuthorCredit}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-500 hidden sm:inline" dir="ltr">
                {activeTest.repoId}
              </span>
              <button
                onClick={handleCloseActiveTest}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                {t.diagExitTest}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Diagnostic Tests Directory & Domain Grid */
        <>
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 text-xs font-bold border border-indigo-700/60 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.diagBadge}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-700/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{t.diagInPageBadge}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{t.diagTestsCountLabel}</div>
                    <div className="text-lg font-black text-amber-300 font-mono">
                      25 {language === 'ar' ? 'اختباراً' : 'Tests'}
                    </div>
                  </div>
                  <div className="h-7 w-px bg-slate-800 mx-2" />
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{t.diagDomainsCountLabel}</div>
                    <div className="text-lg font-black text-indigo-300 font-mono">4 Domains</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {t.diagTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
                  {t.diagSubtitle}
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.diagSearchPlaceholder}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                    >
                      {t.diagClearSearch}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t.diagAllDomains}
            </button>

            {diagnosticDomains.map((dom) => {
              const isSelected = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  onClick={() => setSelectedDomain(dom.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <span className={dom.color}>●</span>
                  <span>{language === 'ar' ? dom.nameAr : dom.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                    {dom.testsCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Diagnostic Tests Grid */}
          {filteredTests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">{t.diagNoTestsFound}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">{t.diagNoTestsDesc}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {t.diagResetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="rounded-2xl border border-slate-800/90 bg-slate-900/90 p-5 hover:border-indigo-500/60 hover:bg-slate-900 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-indigo-950/30"
                >
                  <div className="space-y-3">
                    {/* Top Tag Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 font-mono font-bold text-xs border border-indigo-700/60">
                        {t.diagUnitPrefix} {test.code}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {test.estimatedTime}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                        {language === 'ar' ? test.titleAr : test.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {language === 'ar' ? test.title : test.titleAr}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {language === 'ar' ? test.descriptionAr : test.description}
                    </p>

                    {/* Topics Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {test.topics.slice(0, 3).map((topic, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-indigo-400 font-mono" dir="ltr">
                      {test.repoId}
                    </span>

                    <button
                      onClick={() => handleStartTest(test)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 group-hover:shadow-indigo-600/40 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t.diagOpenTestBtn}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
