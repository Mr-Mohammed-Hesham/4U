import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Calculator, BookMarked, MessageSquare, Calendar, 
  Heart, BarChart2, Bell, Share2, Download, Crown, RefreshCw, 
  FileText, ExternalLink, ChevronDown, Check, X, Shield, BookOpen
} from 'lucide-react';

interface StudentServicesMenuProps {
  favoritesCount: number;
  studyPlanCount: number;
  pendingMistakesCount: number;
  unreadChatCount: number;
  dailyReminderActive: boolean;
  isAdmin: boolean;
  subscriberCount: number;
  isStandalone: boolean;
  isRefreshing: boolean;
  onOpenFavorites: () => void;
  onOpenStats: () => void;
  onOpenFlashcards: () => void;
  onOpenCalculator: () => void;
  onOpenMistakes: () => void;
  onOpenChat: () => void;
  onOpenPlanner: () => void;
  onOpenReminder: () => void;
  onOpenSummaryNotes: () => void;
  onOpenShare: () => void;
  onInstallApp: () => void;
  onOpenAdmin: () => void;
  onRefresh: () => void;
  language: 'ar' | 'en';
}

export const StudentServicesMenu: React.FC<StudentServicesMenuProps> = ({
  favoritesCount,
  studyPlanCount,
  pendingMistakesCount,
  unreadChatCount,
  dailyReminderActive,
  isAdmin,
  subscriberCount,
  isStandalone,
  isRefreshing,
  onOpenFavorites,
  onOpenStats,
  onOpenFlashcards,
  onOpenCalculator,
  onOpenMistakes,
  onOpenChat,
  onOpenPlanner,
  onOpenReminder,
  onOpenSummaryNotes,
  onOpenShare,
  onInstallApp,
  onOpenAdmin,
  onRefresh,
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const totalBadges = (pendingMistakesCount > 0 ? 1 : 0) + (unreadChatCount > 0 ? 1 : 0);

  return (
    <div className="relative" ref={menuRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600/40 hover:bg-indigo-600/60 text-white px-3.5 py-2 rounded-xl backdrop-blur-md border border-indigo-400/50 shadow-md transition flex items-center gap-2 text-sm font-extrabold cursor-pointer hover:scale-105 active:scale-95"
        title="أدوات وخدمات الطالب المتكاملة"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline">
          {language === 'en' ? 'Student Suite' : 'خدمات وأدوات 4U'}
        </span>
        
        {/* Total notification indicator */}
        {totalBadges > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black animate-bounce shadow">
            {unreadChatCount > 0 ? unreadChatCount : '!'}
          </span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Overlay Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto md:left-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 text-right animate-fadeIn">
          
          {/* Header of Dropdown */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>🧰</span>
              <span>{language === 'en' ? 'Student Workspace & Tools' : 'أدوات التفوق والمذاكرة الذكية'}</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
            
            {/* Category 1: Academic & Calculation Tools */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {language === 'en' ? 'Calculation & Review' : '🧮 أدوات الحساب والمراجعة'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Scientific Calculator */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCalculator();
                  }}
                  className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
                    <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 rounded-full">علمية</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">الآلة الحاسبة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">رسم بياني ومعادلات</span>
                </button>

                {/* Flashcards */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFlashcards();
                  }}
                  className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border border-purple-200/50 dark:border-purple-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
                    <span className="text-[9px] bg-purple-500 text-white font-bold px-1.5 rounded-full">🎴 بطاقات</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">بطاقات المراجعة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">التكرار المتباعد</span>
                </button>

              </div>
            </div>

            {/* Category 2: Tracking & Mistake Log */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {language === 'en' ? 'Notebooks & Logs' : '📓 الدفاتر وسجلات المتابعة'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                
                {/* Mistakes Log */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenMistakes();
                  }}
                  className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200/50 dark:border-rose-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <BookMarked className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition" />
                    {pendingMistakesCount > 0 && (
                      <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 rounded-full animate-pulse">
                        {pendingMistakesCount} أخطاء
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">دفتر أخطائي</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">بنك المسائل والحلول</span>
                </button>

                {/* Summary Notes */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSummaryNotes();
                  }}
                  className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200/50 dark:border-amber-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition" />
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 rounded-full">مذكرة</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">مراجعة الامتحان</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">ملاحظاتك الملخصة</span>
                </button>

                {/* Weekly Study Planner */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPlanner();
                  }}
                  className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
                    {studyPlanCount > 0 && (
                      <span className="text-[9px] bg-blue-500 text-white font-bold px-1.5 rounded-full">
                        {studyPlanCount} دروس
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">جدول المذاكرة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">خطة الأسبوع</span>
                </button>

                {/* Dafter Khana external link */}
                <a
                  href="https://hesham-afandi.github.io/DafterKhana/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-200/50 dark:border-indigo-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition" />
                    <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 rounded-full">خارجي</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">مكتبة دفتر خانة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">كتب ومراجع إضافية</span>
                </a>

              </div>
            </div>

            {/* Category 3: Community & Personal Student Progress */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {language === 'en' ? 'Community & Stats' : '💬 التواصل والإحصائيات'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                
                {/* General Chat */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenChat();
                  }}
                  className="p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-right transition cursor-pointer flex flex-col justify-between group relative"
                >
                  <div className="flex items-center justify-between mb-1">
                    <MessageSquare className="w-4 h-4 text-amber-500 animate-pulse group-hover:scale-110 transition" />
                    {unreadChatCount > 0 ? (
                      <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 rounded-full animate-bounce">
                        {unreadChatCount} جديد
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">الشات العام</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">غرف النقاش الطلابية</span>
                </button>

                {/* Student Dashboard */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenStats();
                  }}
                  className="p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-200/50 dark:border-indigo-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition" />
                    <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 rounded-full">شهادة 🎓</span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">لوحة تحكم الطالب</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">إحصائياتي والشهادة</span>
                </button>

                {/* Favorites */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFavorites();
                  }}
                  className="p-2.5 rounded-2xl bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 border border-rose-200/40 dark:border-rose-800/30 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-110 transition" />
                    {favoritesCount > 0 && (
                      <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 rounded-full">
                        {favoritesCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">المفضلة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">الدروس المحفوظة</span>
                </button>

                {/* Daily Reminder */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenReminder();
                  }}
                  className="p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/40 border border-teal-200/50 dark:border-teal-800/40 text-right transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition" />
                    <span className="text-[9px] bg-teal-500 text-white font-bold px-1.5 rounded-full">
                      {dailyReminderActive ? 'مفعّل ⏰' : 'متوقف'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">منبه المذاكرة</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">التذكير اليومي</span>
                </button>

              </div>
            </div>

            {/* Category 4: Platform Actions & Admin */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenShare();
                }}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة المنصة</span>
              </button>

              {!isStandalone && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onInstallApp();
                  }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت التطبيق (PWA)</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onRefresh();
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>تحديث البيانات</span>
              </button>
            </div>

            {/* Admin Badge inside menu if admin */}
            {isAdmin && (
              <div
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 hover:bg-amber-500/30 text-amber-200 text-xs flex items-center justify-between cursor-pointer transition shadow group"
              >
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                  <span className="font-black text-amber-300">لوحة تحكم الأدمن (المشتركين):</span>
                </div>
                <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                  {subscriberCount} مشترك
                </span>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
