import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Presentation, Maximize2, Minimize2, 
  Download, Share2, Check, ExternalLink, FileText,
  Clock, AlertCircle, Sparkles, BookOpen, Video, HelpCircle
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
  onOpenNotes?: () => void;
  onOpenVideo?: () => void;
  onOpenQuiz?: () => void;
}

export const LessonPresentationModal: React.FC<LessonPresentationModalProps> = ({
  isOpen,
  onClose,
  lesson,
  unit,
  subjectName,
  gradeName,
  isEnglish = false,
  onOpenNotes,
  onOpenVideo,
  onOpenQuiz
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsFullscreen(false);
      setCopiedLink(false);
    }
  }, [isOpen, lesson]);

  // Keyboard navigation (ESC to close or exit fullscreen)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen || !lesson) return null;

  const hasPptFile = Boolean(lesson.pptUrl && lesson.pptUrl.trim().length > 0);

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
    const text = `${lesson.title} - ملف الباور بوينت\nمنصة 4U التعليمية: ${window.location.href}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Prepare embed URL if a real PPT file exists
  const getEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return '';
    // If it's already an embed link (e.g. Office 365, Google Slides, OneDrive embed, Canva, etc.)
    if (rawUrl.includes('/embed') || rawUrl.includes('docs.google.com/presentation') || rawUrl.includes('view.officeapps.live.com')) {
      return rawUrl;
    }
    // If it's a direct .ppt/.pptx or cloud URL, route through Microsoft Office Online Viewer or Google Docs Viewer
    if (rawUrl.endsWith('.ppt') || rawUrl.endsWith('.pptx')) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(rawUrl)}`;
    }
    return rawUrl;
  };

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

          {/* Header Controls */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {hasPptFile && (
              <>
                {/* External Link */}
                <a
                  href={lesson.pptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold bg-orange-600/30 hover:bg-orange-600 text-orange-200 hover:text-white border border-orange-500/40 transition flex items-center gap-1 cursor-pointer"
                  title="فتح ملف الباوربوينت في نافذة جديدة"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden md:inline">فتح في نافذة جديدة</span>
                </a>

                {/* Download PPT */}
                <a
                  href={lesson.pptUrl}
                  download
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="تحميل ملف الباوربوينت"
                >
                  <Download className="w-4 h-4" />
                </a>

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </>
            )}

            {/* Share */}
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="نسخ ومشاركة رابط العرض"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition cursor-pointer ml-1"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 relative">
          
          {hasPptFile ? (
            /* REAL POWERPOINT EMBEDDED VIEWER */
            <div className="w-full h-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 flex flex-col">
              <iframe
                src={getEmbedUrl(lesson.pptUrl!)}
                title={lesson.title}
                className="w-full h-full flex-1 border-0"
                allowFullScreen
              />
            </div>
          ) : (
            /* NO FILE UPLOADED YET - CLEAN "COMING SOON INSHA'ALLAH" MESSAGE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mt-20" />

              {/* Icon */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center mx-auto text-4xl mb-6 shadow-inner text-orange-400">
                <Presentation className="w-12 h-12" />
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black mb-4">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>{isEnglish ? 'Upload in progress' : 'قيد الرفع والتجهيز'}</span>
              </div>

              {/* Main Requested Heading */}
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                {isEnglish ? "Coming Soon Insha'Allah, files will be uploaded" : "قريباً إن شاء الله سيتم رفع الملفات"}
              </h2>

              {/* Explanatory Text */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mx-auto mb-8 font-medium">
                {isEnglish 
                  ? `The official PowerPoint presentation file for "${lesson.title}" will be uploaded soon Insha'Allah. In the meantime, you can explore the lesson notes, video explanation, or practice quiz.`
                  : `لم يتم رفع ملف الباور بوينت (PowerPoint) الخاص بدرس: "${lesson.title}" حتى الآن، وسيتم رفع وإتاحة ملفات العرض التقديمي المعتمدة قريباً إن شاء الله.`
                }
              </p>

              {/* Quick Navigation Alternatives */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3 flex-wrap">
                {onOpenNotes && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNotes();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isEnglish ? 'View Lesson Notes' : 'شرح ومستند الدرس'}</span>
                  </button>
                )}

                {onOpenVideo && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenVideo();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>{isEnglish ? 'Watch Video' : 'فيديو الشرح'}</span>
                  </button>
                )}

                {onOpenQuiz && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQuiz();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{isEnglish ? 'Practice Quiz' : 'اختبار الحصة'}</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  {isEnglish ? 'Close' : 'إغلاق'}
                </button>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </AnimatePresence>
  );
};
