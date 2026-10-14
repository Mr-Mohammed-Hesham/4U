import React, { useState } from 'react';
import { 
  BookOpen, Presentation, Video, Award, Heart, CheckCircle, 
  Clock, Share2, Eye, ChevronLeft, ChevronRight, FileText, 
  ExternalLink, Sparkles, BookMarked, Layers, ArrowRight
} from 'lucide-react';
import { Unit, Lesson, Curriculum, AppState } from '../../types';

interface UnifiedCurriculumExplorerProps {
  curriculum: Curriculum;
  appState: AppState;
  onSelectUnitAndLesson: (unit: Unit, lesson: Lesson) => void;
  onSelectUnitOnly: (unit: Unit) => void;
  onOpenLessonNotes: (lesson: Lesson, unit: Unit) => void;
  onOpenPresentation: (lesson: Lesson, unit: Unit) => void;
  onOpenVideo: (lesson: Lesson) => void;
  onOpenExam: (lesson: Lesson, unit: Unit) => void;
  onToggleFavorite: (lesson: Lesson, unit: Unit) => void;
  isFavorite: (lesson: Lesson, unit: Unit) => boolean;
  isLessonRead: (lesson: Lesson, unit: Unit) => boolean;
  isLessonExamDone: (lesson: Lesson, unit: Unit) => boolean;
  onShareLesson: (lesson: Lesson, unit: Unit) => void;
  studentBookUrl?: string;
  language: 'ar' | 'en';
}

export const UnifiedCurriculumExplorer: React.FC<UnifiedCurriculumExplorerProps> = ({
  curriculum,
  appState,
  onSelectUnitAndLesson,
  onSelectUnitOnly,
  onOpenLessonNotes,
  onOpenPresentation,
  onOpenVideo,
  onOpenExam,
  onToggleFavorite,
  isFavorite,
  isLessonRead,
  isLessonExamDone,
  onShareLesson,
  studentBookUrl,
  language
}) => {
  // Default to first unit if none selected, or appState.unit
  const [selectedUnitId, setSelectedUnitId] = useState<number>(() => {
    if (appState.unit?.id) return appState.unit.id;
    return curriculum.units?.[0]?.id || 1;
  });

  const activeUnit = curriculum.units?.find(u => u.id === selectedUnitId) || curriculum.units?.[0];

  if (!curriculum.units || curriculum.units.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-sm my-6">
        <div className="text-5xl mb-4">🚧</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-indigo-300 mb-2">
          {language === 'en' ? 'Coming Soon Insha\'Allah' : 'قريباً إن شاء الله'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {language === 'en' ? 'Curriculum units and lessons will be available soon.' : 'سيتم إضافة محتوى المنهج والدروس قريباً إن شاء الله.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right">
      
      {/* 1. UNIT SELECTOR TABS BAR */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-2 px-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xs">
              📂 وحدات المنهج ({curriculum.units.length} وحدات)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">
              اختر الوحدة لاستعراض كافة دروسها واختباراتها مباشرة دون مغادرة الصفحة:
            </span>
          </div>

          {/* Student Book Link */}
          {studentBookUrl && (
            <a
              href={studentBookUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              title="تصفح كتاب الطالب الوزاري الكامل PDF"
            >
              <span>📖</span>
              <span>كتاب الطالب الوزاري</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Units horizontal scrolling tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {curriculum.units.map(unit => {
            const isSelected = unit.id === selectedUnitId;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnitId(unit.id);
                  onSelectUnitOnly(unit);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 scale-102 ring-2 ring-indigo-400/30'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-base">{unit.icon || '📁'}</span>
                <span>{unit.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {unit.lessons?.length || 0} دروس
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE UNIT HEADER & LESSONS GRID */}
      {activeUnit && (
        <div className="space-y-4">
          
          {/* Active Unit Banner */}
          <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
                {activeUnit.icon || '📁'}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                    الوحدة {activeUnit.id}
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    {activeUnit.lessons?.length} دروس تفاعلية واختبارات
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white">
                  {activeUnit.name}
                </h3>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              💡 اضغط على أي زر أدناه للدخول المباشر للشرح أو الباوربوينت أو الاختبار
            </div>
          </div>

          {/* Lessons Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeUnit.lessons?.map((lesson, idx) => {
              const read = isLessonRead(lesson, activeUnit);
              const done = isLessonExamDone(lesson, activeUnit);
              const fav = isFavorite(lesson, activeUnit);

              return (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group text-right"
                >
                  {/* Top Lesson Meta */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-110 transition-transform">
                          {lesson.icon || '📖'}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                            درس #{idx + 1}
                          </span>
                          {lesson.duration && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-0.5 inline-flex">
                              <Clock className="w-3 h-3 inline" />
                              {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Favorite & Share Quick Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(lesson, activeUnit);
                          }}
                          className={`p-1.5 rounded-xl transition cursor-pointer ${
                            fav 
                              ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40' 
                              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title="إضافة للمفضلة"
                        >
                          <Heart className={`w-4 h-4 ${fav ? 'fill-rose-500' : ''}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShareLesson(lesson, activeUnit);
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="مشاركة رابط الدرس"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Title */}
                    <h4 
                      onClick={() => onSelectUnitAndLesson(activeUnit, lesson)}
                      className="font-black text-base text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition cursor-pointer leading-snug line-clamp-2"
                    >
                      {lesson.title}
                    </h4>

                    {/* Focus Question if present */}
                    {lesson.focusQuestion && (
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 p-2 rounded-xl mb-3 border border-indigo-100 dark:border-indigo-900/40 line-clamp-2">
                        🎯 <span className="font-bold">{lesson.focusQuestion}</span>
                      </p>
                    )}

                    {/* Read & Exam Status Badges */}
                    <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                      {read ? (
                        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>تمت القراءة</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          لم يُقرأ بعد
                        </span>
                      )}

                      {done && (
                        <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" />
                          <span>تم اجتياز الاختبار 🏆</span>
                        </span>
                      )}
                    </div>

                    {/* Primary Button: Open Full Lesson Details View with Audio Teacher & Notes */}
                    <button
                      onClick={() => onSelectUnitAndLesson(activeUnit, lesson)}
                      className="w-full py-2.5 px-3 mb-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm hover:shadow-indigo-500/25 active:scale-95 cursor-pointer"
                      title={language === 'en' ? 'Enter interactive lesson page with Audio Teacher and Notebook' : 'دخول صفحة الدرس الكاملة مع المعلم الصوتي ودفتر الملاحظات'}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{language === 'en' ? 'Lesson Study & Audio Teacher 🎧' : 'دخول الدرس والمعلم الصوتي والملاحظات 🎧'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 4 Direct Action Buttons Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-4 gap-1.5">
                    
                    {/* 1. Explanation / Notes */}
                    <button
                      onClick={() => onOpenLessonNotes(lesson, activeUnit)}
                      className="py-2 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[11px] font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                      title="قراءة ملخص وشرح الدرس"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>الشرح</span>
                    </button>

                    {/* 2. PowerPoint */}
                    <button
                      onClick={() => onOpenPresentation(lesson, activeUnit)}
                      className="py-2 px-1 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-[11px] font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                      title="عرض الباوربوينت التفاعلي للدرس"
                    >
                      <Presentation className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      <span>بوربوينت</span>
                    </button>

                    {/* 3. Video */}
                    <button
                      onClick={() => onOpenVideo(lesson)}
                      className="py-2 px-1 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[11px] font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                      title="مشاهدة فيديو الشرح"
                    >
                      <Video className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>فيديو</span>
                    </button>

                    {/* 4. Exam */}
                    <button
                      onClick={() => onOpenExam(lesson, activeUnit)}
                      className="py-2 px-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black transition flex flex-col items-center justify-center gap-1 cursor-pointer shadow-sm hover:scale-102"
                      title="اختبار الدرس الذاتي"
                    >
                      <Award className="w-3.5 h-3.5 text-slate-950" />
                      <span>اختبار</span>
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
