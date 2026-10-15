import React, { useState } from 'react';
import { 
  Compass, ChevronDown, BookOpen, Layers, Calendar, 
  Sparkles, Check, ArrowRight, RotateCcw, Filter, Eye
} from 'lucide-react';
import { DB, countries } from '../../data';
import { AppState, Curriculum, Lesson, Unit } from '../../types';
import { 
  getEnglishGradeName, 
  getEnglishSubjectName, 
  getEnglishTermName, 
  getEnglishStreamName 
} from '../../utils/language';

const COUNTRY_INFO: Record<string, { name: string; flag: string }> = {
  UAE: { name: 'الإمارات', flag: '🇦🇪' },
  Saudi: { name: 'السعودية', flag: '🇸🇦' },
  Kuwait: { name: 'الكويت', flag: '🇰🇼' },
  Egypt: { name: 'مصر', flag: '🇪🇬' },
  Oman: { name: 'عُمان', flag: '🇴🇲' },
  Qatar: { name: 'قطر', flag: '🇶🇦' },
  Bahrain: { name: 'البحرين', flag: '🇧🇭' },
};

interface SmartNavigatorBarProps {
  appState: AppState;
  onNavigate: (updater: Partial<AppState>) => void;
  activePlatformSection: 'curriculum' | 'eot' | 'sat' | 'ig' | 'ms';
  onSectionChange: (section: 'curriculum' | 'eot' | 'sat' | 'ig' | 'ms') => void;
  activeCurriculum: Curriculum | null;
  language: 'ar' | 'en';
  onReset: () => void;
  isCurriculumImported2026?: boolean;
}

export const SmartNavigatorBar: React.FC<SmartNavigatorBarProps> = ({
  appState,
  onNavigate,
  activePlatformSection,
  onSectionChange,
  activeCurriculum,
  language,
  onReset,
  isCurriculumImported2026 = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Handlers for select change
  const handleCountryChange = (val: string) => {
    onNavigate({ country: val || null });
  };

  const handleSectionChange = (val: 'curriculum' | 'eot' | 'sat' | 'ig' | 'ms') => {
    onSectionChange(val);
  };

  const handleTermChange = (termId: string) => {
    if (!termId) {
      onNavigate({ term: null });
      return;
    }
    const t = DB.terms.find(item => item.id.toString() === termId);
    if (t) {
      onNavigate({ 
        term: t,
        stream: appState.stream || DB.streams[0],
        program: appState.program,
        grade: appState.grade,
        subject: appState.subject,
        academicYear: appState.academicYear || '2026',
        unit: null,
        lesson: null
      });
    }
  };

  const handleStreamChange = (streamId: string) => {
    if (!streamId) {
      onNavigate({ stream: null, program: null });
      return;
    }
    let adv = null;
    let prog = null;
    if (streamId === 'advanced-inspire') {
      adv = DB.streams.find(s => s.id === 'advanced') || null;
      prog = DB.programs.find(p => p.id === 'inspire') || null;
    } else if (streamId === 'advanced-bridge') {
      adv = DB.streams.find(s => s.id === 'advanced') || null;
      prog = DB.programs.find(p => p.id === 'bridge') || null;
    } else if (streamId === 'advanced-bridge-en') {
      adv = DB.streams.find(s => s.id === 'advanced') || null;
      prog = DB.programs.find(p => p.id === 'bridge-en') || null;
    } else {
      adv = DB.streams.find(item => item.id === streamId) || null;
      prog = null;
    }

    onNavigate({ 
      stream: adv, 
      program: prog,
      grade: appState.grade,
      subject: appState.subject,
      academicYear: appState.academicYear || '2026',
      unit: null,
      lesson: null
    });
  };

  const handleGradeChange = (gradeId: string) => {
    if (!gradeId) {
      onNavigate({ grade: null });
      return;
    }
    const g = DB.grades.find(item => item.id.toString() === gradeId);
    if (g) {
      onNavigate({ 
        grade: g,
        stream: appState.stream || DB.streams[0],
        program: appState.program,
        subject: appState.subject || DB.subjects[0],
        academicYear: appState.academicYear || '2026',
        unit: null,
        lesson: null
      });
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    if (!subjectId) {
      onNavigate({ subject: null });
      return;
    }
    const s = DB.subjects.find(item => item.id === subjectId);
    if (s) {
      onNavigate({ 
        subject: s,
        grade: appState.grade,
        stream: appState.stream || DB.streams[0],
        program: appState.program,
        academicYear: appState.academicYear || '2026',
        unit: null,
        lesson: null
      });
    }
  };

  const handleYearChange = (year: string) => {
    onNavigate({ 
      academicYear: year || '2026',
      unit: null,
      lesson: null
    });
  };

  const handleLessonDirectJump = (val: string) => {
    if (!val || !activeCurriculum) return;
    const [uIdStr, lIdStr] = val.split('-');
    const uId = Number(uIdStr);
    const lId = Number(lIdStr);
    const unit = activeCurriculum.units.find(u => u.id === uId);
    if (unit) {
      const lesson = unit.lessons.find(l => l.id === lId);
      if (lesson) {
        onNavigate({ unit, lesson });
      }
    }
  };

  // Helper values
  const currentStreamValue = appState.stream?.id === 'advanced'
    ? (appState.program?.id === 'inspire'
        ? 'advanced-inspire'
        : appState.program?.id === 'bridge-en'
        ? 'advanced-bridge-en'
        : 'advanced-bridge')
    : (appState.stream?.id || '');

  const hasSelections = Boolean(
    appState.country || appState.term || appState.stream || appState.grade || appState.subject
  );

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg mb-6 transition-all duration-300 overflow-hidden text-right">
      {/* Top Header of the Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-sm flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>{language === 'en' ? 'Smart Curriculum Navigator' : 'محدد المنهج والوصول السريع'}</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded-full border border-indigo-500/20">
                {language === 'en' ? 'Direct 1-Click Jump' : 'تصفح فوري بالقوائم المنسدلة ⚡'}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasSelections && (
            <button
              onClick={onReset}
              className="text-[11px] text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 font-bold px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
              title="إعادة ضبط الاختيارات"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'en' ? 'Reset' : 'إعادة ضبط'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-black px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-1 cursor-pointer"
          >
            <span>{isExpanded ? (language === 'en' ? 'Collapse' : 'طي المحدد') : (language === 'en' ? 'Expand' : 'فتح المحدد')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown controls grid */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
          
          {/* 1. Country Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              🌍 {language === 'en' ? 'Country' : 'الدولة'}
            </label>
            <div className="relative">
              <select
                value={appState.country || ''}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                <option value="">{language === 'en' ? 'Choose Country...' : 'اختر الدولة...'}</option>
                {countries.map(cId => {
                  const info = COUNTRY_INFO[cId] || { name: cId, flag: '📍' };
                  return (
                    <option key={cId} value={cId}>
                      {info.flag} {info.name}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 2. Platform Section Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              📑 {language === 'en' ? 'Section' : 'القسم'}
            </label>
            <div className="relative">
              <select
                value={activePlatformSection}
                onChange={(e) => handleSectionChange(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                <option value="curriculum">📚 المناهج والدروس</option>
                <option value="eot">📜 الهياكل الوزارية (EOT)</option>
                <option value="sat">🎓 اختبارات السات (SAT)</option>
                <option value="ig">📝 بنك امتحانات IG</option>
                <option value="ms">💻 اختبارات مايكروسوفت (MS)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Term Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              📅 {language === 'en' ? 'Academic Term' : 'الفصل الدراسي'}
            </label>
            <div className="relative">
              <select
                value={appState.term?.id ? appState.term.id.toString() : ''}
                onChange={(e) => handleTermChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                <option value="">{language === 'en' ? 'Choose Term...' : 'اختر الفصل...'}</option>
                {DB.terms.map(t => (
                  <option key={t.id} value={t.id.toString()}>
                    {t.icon} {language === 'en' ? getEnglishTermName(t.name, t.id) : t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 4. Stream & Program Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              🛤️ {language === 'en' ? 'Stream / Program' : 'المسار والبرنامج'}
            </label>
            <div className="relative">
              <select
                value={currentStreamValue}
                onChange={(e) => handleStreamChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                <option value="">{language === 'en' ? 'Choose Stream...' : 'اختر المسار...'}</option>
                <option value="general">🟢 مسار عام (General)</option>
                <option value="advanced-bridge">🔵 متقدم - Bridge (عربي)</option>
                <option value="advanced-bridge-en">🇬🇧 متقدم - Bridge (English 2026)</option>
                <option value="advanced-inspire">🟣 متقدم - Inspire (English)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 5. Grade Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              🎓 {language === 'en' ? 'Grade' : 'الصف الدراسي'}
            </label>
            <div className="relative">
              <select
                value={appState.grade?.id ? appState.grade.id.toString() : ''}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                <option value="">{language === 'en' ? 'Choose Grade...' : 'اختر الصف...'}</option>
                {DB.grades.map(g => (
                  <option key={g.id} value={g.id.toString()}>
                    {g.icon} {language === 'en' ? getEnglishGradeName(g.name, g.id) : g.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 6. Subject Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              ⚛️ {language === 'en' ? 'Subject' : 'المادة العلمية'}
            </label>
            <div className="relative">
              <select
                value={appState.subject?.id || ''}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                <option value="">{language === 'en' ? 'Choose Subject...' : 'اختر المادة...'}</option>
                {DB.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {language === 'en' ? getEnglishSubjectName(s.name, s.id) : s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 7. Academic Year Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block">
              🗓️ {language === 'en' ? 'Year' : 'السنة'}
            </label>
            <div className="relative">
              <select
                value={appState.academicYear || '2025'}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right"
              >
                {activePlatformSection === 'eot' ? (
                  <>
                    <option value="2025">هياكل 2025 (متاحة بالكامل) ✅</option>
                    <option value="2026">هياكل 2026 (ستتوفر قريباً إن شاء الله) ⏳</option>
                  </>
                ) : (
                  <>
                    <option value="2025">منهج 2025 ✅</option>
                    <option value="2026">
                      {isCurriculumImported2026 ? 'منهج 2026 (مستورد) 🚀' : 'منهج 2026 ⏳'}
                    </option>
                  </>
                )}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 8. Direct Jump to Unit/Lesson Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 block flex items-center justify-between">
              <span>📖 {language === 'en' ? 'Direct Lesson Jump' : 'الدرس المباشر'}</span>
              {activeCurriculum && activeCurriculum.units?.length > 0 && (
                <span className="text-[9px] bg-emerald-500 text-white font-mono px-1 rounded">
                  {activeCurriculum.units.reduce((acc, u) => acc + (u.lessons?.length || 0), 0)}
                </span>
              )}
            </label>
            <div className="relative">
              <select
                value={appState.lesson && appState.unit ? `${appState.unit.id}-${appState.lesson.id}` : ''}
                onChange={(e) => handleLessonDirectJump(e.target.value)}
                disabled={!activeCurriculum || !activeCurriculum.units || activeCurriculum.units.length === 0}
                className="w-full bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl px-2.5 py-2 text-xs font-black text-indigo-950 dark:text-indigo-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer appearance-none text-right disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">
                  {activeCurriculum && activeCurriculum.units?.length > 0
                    ? (language === 'en' ? 'Jump to Lesson...' : '⚡ انتقال سريع لدرس...')
                    : (language === 'en' ? 'Select Subject First' : 'حدد المادة أولاً')}
                </option>
                {activeCurriculum?.units?.map(unit => (
                  <optgroup key={unit.id} label={`📁 ${unit.name}`}>
                    {unit.lessons.map(lesson => (
                      <option key={`${unit.id}-${lesson.id}`} value={`${unit.id}-${lesson.id}`}>
                        {lesson.icon} {lesson.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-500 absolute left-2 top-3 pointer-events-none" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
