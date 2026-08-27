import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Presentation, ChevronRight, ChevronLeft, Maximize2, Minimize2, 
  Download, Printer, Sparkles, Share2, Eye, Play, Pause, RefreshCw, 
  Layers, CheckCircle2, Award, Copy, Check, ExternalLink, HelpCircle, FileText,
  Palette, Grid, MonitorPlay, ZoomIn, ZoomOut
} from 'lucide-react';
import { Lesson, Unit } from '../../types';

interface LessonPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  unit?: Unit | null;
  subjectName?: string;
  gradeName?: string;
  isEnglish?: boolean;
}

interface SlideItem {
  id: number;
  type: 'cover' | 'intro' | 'bullet' | 'formula' | 'table' | 'summary' | 'quiz_prompt';
  title: string;
  subtitle?: string;
  content?: string | string[];
  formula?: string;
  headers?: string[];
  rows?: string[][];
  tag?: string;
  icon?: string;
  bgGradient?: string;
}

export const LessonPresentationModal: React.FC<LessonPresentationModalProps> = ({
  isOpen,
  onClose,
  lesson,
  unit,
  subjectName,
  gradeName,
  isEnglish = false
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'navy' | 'emerald' | 'amber' | 'dark' | 'gradient'>('navy');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Generate presentation slides dynamically from lesson content
  const slides: SlideItem[] = React.useMemo(() => {
    if (!lesson) return [];

    const list: SlideItem[] = [];

    // Slide 1: Cover Slide
    list.push({
      id: 1,
      type: 'cover',
      title: lesson.title,
      subtitle: `${subjectName || 'المنهج الدراسي'} • ${gradeName || 'المرحلة الدراسية'} ${unit ? `• ${unit.name}` : ''}`,
      tag: isEnglish ? 'Official Presentation' : 'عرض تقديمي شامل ومبسّط',
      icon: lesson.icon || '📊'
    });

    const c = lesson.content;

    // Slide 2: Lesson Introduction / Learning Objectives
    if (c?.intro) {
      list.push({
        id: list.length + 1,
        type: 'intro',
        title: isEnglish ? 'Lesson Overview & Key Concepts' : '💡 الفكرة العامة ومحاور الدرس',
        subtitle: isEnglish ? 'Fundamental concept to master' : 'المفهوم الأساسي والتمهيد العلمي',
        content: c.intro,
        icon: '💡'
      });
    }

    // Dynamic Content Sections
    if (c?.sections && Array.isArray(c.sections)) {
      c.sections.forEach((sec, idx) => {
        if (sec.type === 'formula') {
          list.push({
            id: list.length + 1,
            type: 'formula',
            title: sec.title || (isEnglish ? 'Mathematical / Physical Formula' : '📐 القانون والصيغة الرياضية'),
            subtitle: isEnglish ? 'Core equation for problem solving' : 'العلاقة الرياضية الأساسية لحساب المسائل',
            formula: typeof sec.content === 'string' ? sec.content : '',
            icon: '📐'
          });
        } else if (sec.type === 'table') {
          list.push({
            id: list.length + 1,
            type: 'table',
            title: sec.title || (isEnglish ? 'Comparison & Classification Table' : '📊 جدول المقارنة والتحليل العلمي'),
            subtitle: isEnglish ? 'Systematic breakdown of concepts' : 'التصنيف المنهجي المنظم للفهم السريع',
            headers: sec.headers || [],
            rows: sec.rows || [],
            icon: '📊'
          });
        } else if (sec.type === 'bullets') {
          list.push({
            id: list.length + 1,
            type: 'bullet',
            title: sec.title || (isEnglish ? 'Key Scientific Points' : '📋 النقاط والمفاهيم الجوهرية'),
            subtitle: isEnglish ? 'Essential elements to remember' : 'نقاط الحفظ والفهم والتحليل',
            content: sec.content,
            icon: '📋'
          });
        } else {
          list.push({
            id: list.length + 1,
            type: 'intro',
            title: sec.title || (isEnglish ? 'Lesson Section' : '📌 محور دراسي هام'),
            subtitle: isEnglish ? 'Core conceptual explanation' : 'شرح وتوضيح المفهوم',
            content: sec.content,
            icon: '📌'
          });
        }
      });
    }

    // If no rich content exists, create a graceful informative slide
    if (list.length <= 1) {
      list.push({
        id: 2,
        type: 'intro',
        title: isEnglish ? 'Lesson Content Summary' : '📌 ملخص محاور الحصة',
        subtitle: isEnglish ? 'Standard Curriculum Topic' : 'محتوى الدرس المعتمد',
        content: isEnglish 
          ? `Interactive presentation prepared for: ${lesson.title}. Explore key laws, applications, and solve exam questions.`
          : `عرض تقديمي وتلخيصي لدرس: "${lesson.title}". يحتوي على شرح القوانين، الرسوم البيانية، والأفكار الامتحانية الهامة.`,
        icon: '📚'
      });
    }

    // Final Slide: Summary & Quiz Prompt
    list.push({
      id: list.length + 1,
      type: 'quiz_prompt',
      title: isEnglish ? 'Summary & Interactive Quiz' : '🎯 الخلاصة والتقييم الذاتي',
      subtitle: isEnglish ? 'Test your understanding now' : 'هل أنت جاهز لاختبار فهمك؟',
      content: isEnglish 
        ? 'Great job reviewing this lesson presentation! Proceed to the practice quiz and test your mastery.'
        : 'أحسنت بمراجعة هذا العرض التقديمي! يمكنك الآن خوض الاختبار التجريبي التفاعلي لتثبيت المعلومات والتأكد من إتقانك لكافة القوانين.',
      icon: '🏆'
    });

    return list;
  }, [lesson, unit, subjectName, gradeName, isEnglish]);

  // Reset slide on open
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
      setIsAutoPlaying(false);
      setShowThumbnails(false);
      setZoomLevel(1);
    }
  }, [isOpen, lesson]);

  // Keyboard navigation (Left/Right Arrows, Space, ESC)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, slides.length, isFullscreen]);

  // Auto-play slideshow timer
  useEffect(() => {
    let interval: any;
    if (isOpen && isAutoPlaying && slides.length > 0) {
      interval = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1 < slides.length ? prev + 1 : 0));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isAutoPlaying, slides.length]);

  if (!isOpen || !lesson) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyShare = () => {
    const text = `${lesson.title} - باور بوينت وعرض تقديمي\nمنصة 4U التعليمية: ${window.location.href}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  // Theme Styles
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950',
          card: 'bg-slate-900/90 border-emerald-500/40 text-emerald-100',
          accent: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
          btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
          border: 'border-emerald-500/30'
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950',
          card: 'bg-slate-900/90 border-amber-500/40 text-amber-100',
          accent: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
          btn: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black',
          border: 'border-amber-500/30'
        };
      case 'dark':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-black to-slate-900',
          card: 'bg-slate-900/90 border-slate-700 text-slate-100',
          accent: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
          btn: 'bg-cyan-600 hover:bg-cyan-500 text-white',
          border: 'border-slate-800'
        };
      case 'gradient':
        return {
          bg: 'bg-gradient-to-br from-purple-950 via-slate-950 to-pink-950',
          card: 'bg-slate-900/90 border-pink-500/40 text-pink-100',
          accent: 'text-pink-400 bg-pink-500/20 border-pink-500/30',
          btn: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white',
          border: 'border-pink-500/30'
        };
      case 'navy':
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-900',
          card: 'bg-slate-900/90 border-indigo-500/40 text-indigo-100',
          accent: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
          btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
          border: 'border-indigo-500/30'
        };
    }
  };

  const themeStyle = getThemeClasses();

  return (
    <AnimatePresence>
      <div 
        ref={modalContainerRef}
        className="fixed inset-0 z-[150] flex flex-col bg-slate-950/95 backdrop-blur-xl text-white select-none animate-fadeIn overflow-hidden"
      >
        {/* Top PowerPoint Ribbon / Header Bar */}
        <header className="shrink-0 h-16 bg-slate-900/95 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between gap-3 shadow-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 shadow-inner">
              <Presentation className="w-5 h-5" />
            </div>
            <div className="min-w-0 text-right">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-slate-950 px-2 py-0.5 rounded-md">
                  PowerPoint Presentation
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline-block">
                  {subjectName} • {gradeName}
                </span>
              </div>
              <h2 className="text-sm md:text-base font-black text-white truncate">
                {lesson.title}
              </h2>
            </div>
          </div>

          {/* Ribbon Controls */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Auto Play / Pause Slideshow */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isAutoPlaying ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل العرض تلقائياً (5 ثواني لكل شريحة)'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden md:inline">{isAutoPlaying ? 'إيقاف مؤقت' : 'عرض تلقائي'}</span>
            </button>

            {/* Thumbnail Drawer Toggle */}
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showThumbnails ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="عرض كافة الشرائح (Thumbnails)"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden md:inline">الشرائح</span>
            </button>

            {/* Theme Selector Dropdown / Cycle */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <Palette className="w-3.5 h-3.5 text-slate-400 mx-1" />
              {(['navy', 'emerald', 'amber', 'gradient', 'dark'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-5 h-5 rounded-md transition ${
                    theme === t ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: 
                      t === 'navy' ? '#312e81' : 
                      t === 'emerald' ? '#065f46' : 
                      t === 'amber' ? '#b45309' : 
                      t === 'gradient' ? '#be185d' : '#0f172a'
                  }}
                  title={`سمة: ${t}`}
                />
              ))}
            </div>

            {/* Custom External PPT Link if provided */}
            {lesson.pptUrl && (
              <a
                href={lesson.pptUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold bg-orange-600/30 hover:bg-orange-600 text-orange-200 hover:text-white border border-orange-500/40 transition flex items-center gap-1 cursor-pointer"
                title="فتح ملف الباوربوينت الأصلي"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden md:inline">الملف الأصلي</span>
              </a>
            )}

            {/* Share presentation */}
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="نسخ ومشاركة رابط العرض"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Print / Export Slides */}
            <button
              onClick={handlePrintOrDownload}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer hidden sm:flex"
              title="طباعة وحفظ الشرائح PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition cursor-pointer ml-1"
              title="إغلاق العرض التقديمي"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Presentation Stage & Sidebar Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Thumbnails Sidebar (Toggleable) */}
          {showThumbnails && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full bg-slate-900 border-l border-slate-800 p-3 overflow-y-auto hidden md:flex flex-col gap-2 shrink-0 z-10 custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400">قائمة الشرائح ({slides.length})</span>
                <span className="text-[10px] text-indigo-400 font-mono">Slide Deck</span>
              </div>

              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-2.5 rounded-xl border text-right transition flex items-start gap-2 cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    currentSlideIndex === idx ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{s.title}</p>
                    <span className="text-[9px] opacity-70 block truncate">{s.subtitle || s.type}</span>
                  </div>
                </button>
              ))}
            </motion.aside>
          )}

          {/* Active Slide Canvas (16:9 Presentation Stage) */}
          <main className={`flex-1 flex flex-col items-center justify-center p-3 md:p-6 lg:p-8 overflow-y-auto ${themeStyle.bg} relative`}>
            
            {/* Slide Frame with 16:9 Aspect Ratio Container */}
            <div className="w-full max-w-5xl aspect-auto md:aspect-[16/9] min-h-[420px] md:min-h-[500px] flex flex-col justify-between rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl relative border overflow-hidden backdrop-blur-md transition-all duration-300"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderColor: themeStyle.border.replace('border-', '')
              }}
            >
              {/* Background Geometric Watermarks */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

              {/* Slide Header / Badge */}
              <div className="flex items-center justify-between shrink-0 mb-4 z-10">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${themeStyle.accent}`}>
                    {currentSlide.icon || '📌'} {currentSlide.tag || `الشريحة ${currentSlideIndex + 1} من ${slides.length}`}
                  </span>
                  {unit && (
                    <span className="text-[11px] text-slate-400 hidden sm:inline-block font-semibold">
                      {unit.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                </div>
              </div>

              {/* Slide Dynamic Body */}
              <div className="flex-1 flex flex-col justify-center my-auto z-10 text-right space-y-6">
                
                {/* 1. COVER SLIDE */}
                {currentSlide.type === 'cover' && (
                  <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-center space-y-6 py-6 md:py-12"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto text-4xl md:text-5xl shadow-2xl ring-4 ring-white/10 animate-pulse">
                      {currentSlide.icon}
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs md:text-sm font-black text-amber-400 bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-widest inline-block">
                        {isEnglish ? 'Interactive Lecture Slides' : 'عرض تقديمي تفاعلي معتمد 🌟'}
                      </span>
                      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        {currentSlide.title}
                      </h1>
                      <p className="text-sm sm:text-lg text-indigo-200/90 font-medium max-w-2xl mx-auto">
                        {currentSlide.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
                      <button
                        onClick={handleNextSlide}
                        className={`px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition cursor-pointer active:scale-95 ${themeStyle.btn}`}
                      >
                        <span>{isEnglish ? 'Start Presentation' : 'ابدأ استعراض العرض'}</span>
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. INTRO SLIDE */}
                {currentSlide.type === 'intro' && (
                  <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="border-b border-slate-800 pb-3">
                      <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <span className="text-3xl">{currentSlide.icon}</span>
                        <span>{currentSlide.title}</span>
                      </h2>
                      {currentSlide.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentSlide.subtitle}</p>
                      )}
                    </div>

                    <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
                      <p className="text-base sm:text-xl font-bold text-indigo-100 leading-relaxed whitespace-pre-line">
                        {currentSlide.content as string}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 3. FORMULA / LAW SLIDE */}
                {currentSlide.type === 'formula' && (
                  <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-slate-800 pb-3">
                      <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <span className="text-3xl">{currentSlide.icon}</span>
                        <span>{currentSlide.title}</span>
                      </h2>
                      {currentSlide.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentSlide.subtitle}</p>
                      )}
                    </div>

                    <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border-2 border-indigo-500/50 shadow-2xl text-center space-y-4">
                      <span className="text-[11px] font-black text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                        {isEnglish ? 'Mathematical Equation' : 'الصيغة الرياضية والقانون الأساسي'}
                      </span>
                      <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-wide py-2 select-text" dir="ltr">
                        {currentSlide.formula}
                      </div>
                      <p className="text-xs text-slate-400 max-w-lg mx-auto">
                        تأكد من حفظ الرموز والوحدات الفيزيائية / الرياضية المستخدمة في هذه المعادلة بدقة لحل المسائل الامتحانية.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 4. TABLE SLIDE */}
                {currentSlide.type === 'table' && (
                  <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-800 pb-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
                        <span className="text-2xl">{currentSlide.icon}</span>
                        <span>{currentSlide.title}</span>
                      </h2>
                      {currentSlide.subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{currentSlide.subtitle}</p>
                      )}
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-lg">
                      <table className="w-full text-right text-xs sm:text-sm border-collapse">
                        {currentSlide.headers && currentSlide.headers.length > 0 && (
                          <thead>
                            <tr className="bg-slate-800/90 text-white font-black">
                              {currentSlide.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-3.5 border-b border-slate-700">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {currentSlide.rows?.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-800/80 hover:bg-slate-800/40 transition">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3.5 text-slate-200 font-semibold">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 5. BULLETS / KEY POINTS SLIDE */}
                {currentSlide.type === 'bullet' && (
                  <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-800 pb-3">
                      <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <span className="text-3xl">{currentSlide.icon}</span>
                        <span>{currentSlide.title}</span>
                      </h2>
                      {currentSlide.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">{currentSlide.subtitle}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {Array.isArray(currentSlide.content) && currentSlide.content.map((point, pIdx) => (
                        <div 
                          key={pIdx}
                          className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 shadow-sm hover:border-indigo-500/50 transition"
                        >
                          <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {pIdx + 1}
                          </span>
                          <p className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 6. QUIZ PROMPT SLIDE */}
                {currentSlide.type === 'quiz_prompt' && (
                  <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto text-4xl shadow-xl">
                      🏆
                    </div>

                    <div className="space-y-2 max-w-xl mx-auto">
                      <h2 className="text-2xl sm:text-4xl font-black text-white">
                        {currentSlide.title}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                        {currentSlide.content as string}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                      <button
                        onClick={() => setCurrentSlideIndex(0)}
                        className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition cursor-pointer flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>إعادة تشغيل العرض من البداية</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Slide Footer */}
              <div className="shrink-0 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 z-10">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  منصة 4U التعليمية 2026 • باور بوينت الحصة
                </span>

                <span className="font-mono text-slate-500">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>
            </div>

            {/* Bottom Floating Navigation Toolbar */}
            <div className="mt-4 flex items-center gap-3 bg-slate-900/95 border border-slate-800 px-4 py-2 rounded-2xl shadow-xl z-20">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className={`p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  currentSlideIndex === 0 
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="الشريحة السابقة (السهم الأيمن / PageUp)"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:inline">السابق</span>
              </button>

              {/* Slide Progress Dots */}
              <div className="flex items-center gap-1.5 px-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlideIndex === idx 
                        ? 'w-6 bg-indigo-500 shadow-md' 
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`انتقل للشريحة ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === slides.length - 1}
                className={`p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  currentSlideIndex === slides.length - 1 
                    ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
                title="الشريحة التالية (السهم الأيسر / المسافة / PageDown)"
              >
                <span className="hidden sm:inline">التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </main>
        </div>
      </div>
    </AnimatePresence>
  );
};
