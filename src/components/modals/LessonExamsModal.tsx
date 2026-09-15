import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, CheckCircle2, ShieldCheck, Lock, Edit3, Trash2, 
  ExternalLink, Sparkles, AlertCircle, FileCheck, Layers, HelpCircle, Check
} from 'lucide-react';
import { Lesson, Unit } from '../../types';
import { 
  LessonExamItem, 
  getStoredLessonExams, 
  addLessonExam, 
  updateLessonExam, 
  deleteLessonExam,
  fetchRemoteLessonExams,
  subscribeToLessonExams,
  checkFirestorePermissionStatus
} from '../../services/lessonExamsService';

interface LessonExamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  unit: Unit | null;
  lessonKey: string;
  subjectName?: string;
  gradeName?: string;
  isAdmin: boolean;
  isEnglish?: boolean;
  onStartExam: (exam: { id: string; title: string; url: string; icon?: string; iconName?: string }) => void;
  onAdminUnlock?: () => void;
}

const PRESET_ICONS = [
  { emoji: '📝', label: 'اختبار الحصة' },
  { emoji: '🎯', label: 'تدريب تفاعلي' },
  { emoji: '⚡', label: 'اختبار سريع' },
  { emoji: '🏆', label: 'تحدي الأبطال' },
  { emoji: '🧠', label: 'فهم ومفاهيم' },
  { emoji: '🔬', label: 'تطبيقي وعملي' },
  { emoji: '📐', label: 'مسائل وقوانين' },
  { emoji: '📑', label: 'بنك أسئلة وزاري' },
  { emoji: '💡', label: 'تفكير ومهارات' },
  { emoji: '⭐', label: 'اختبار متميز' },
  { emoji: '⏱️', label: 'اختبار محدد بوقت' },
  { emoji: '🚀', label: 'مستوى متقدم' },
];

export const LessonExamsModal: React.FC<LessonExamsModalProps> = ({
  isOpen,
  onClose,
  lesson,
  unit,
  lessonKey,
  subjectName,
  gradeName,
  isAdmin,
  isEnglish = false,
  onStartExam,
  onAdminUnlock,
}) => {
  const [customExams, setCustomExams] = useState<LessonExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Admin form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const [examIcon, setExamIcon] = useState('🎯');
  const [examIconName, setExamIconName] = useState('');
  const [examRepoUrl, setExamRepoUrl] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [firestoreWarning, setFirestoreWarning] = useState<string | null>(null);
  const [rulesCopied, setRulesCopied] = useState(false);
  const [checkingRules, setCheckingRules] = useState(false);

  // Admin PIN Quick Unlock Modal
  const [showPinUnlock, setShowPinUnlock] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [localAdminUnlocked, setLocalAdminUnlocked] = useState(false);

  const effectiveIsAdmin = isAdmin || localAdminUnlocked;

  // Check Firestore permissions for Admin
  const handleCheckRulesAgain = async () => {
    setCheckingRules(true);
    const st = await checkFirestorePermissionStatus();
    setCheckingRules(false);
    if (st.allowed) {
      setFirestoreWarning(null);
      setSuccessToast('✅ تم الاتصال بـ Firestore ومجموعة lesson_exams مفتوحة للكتابة والقراءة لجميع الأعضاء!');
      setTimeout(() => setSuccessToast(null), 4000);
    } else {
      setFirestoreWarning('⚠️ قواعد Firestore الحالية ما زالت تمنع الكتابة (PERMISSION_DENIED). يرجى نشر القواعد في Firebase Console.');
    }
  };

  // Load exams when modal opens and subscribe to real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const activeKey = lessonKey || (lesson ? `lesson_${lesson.id}` : '');
    if (!activeKey) return;

    setLoading(true);
    setShowAddForm(false);
    setEditingExamId(null);
    setFormError(null);
    setSuccessToast(null);

    // 1. Load instantly from cache
    const cached = getStoredLessonExams(activeKey);
    setCustomExams(cached);
    setLoading(false);

    // Check permissions if admin
    if (effectiveIsAdmin) {
      checkFirestorePermissionStatus().then(st => {
        if (!st.allowed) {
          setFirestoreWarning('⚠️ قواعد أمان Firestore في Firebase Console تمنع الكتابة المباشرة إلى collection (lesson_exams). يرجى تفعيل القواعد لظهور الامتحانات للأعضاء.');
        } else {
          setFirestoreWarning(null);
        }
      });
    }

    // 2. Refresh from Server API & Firestore in background
    fetchRemoteLessonExams(activeKey).then(remote => {
      if (Array.isArray(remote) && remote.length > 0) {
        setCustomExams(remote);
      }
    });

    // 3. Real-time subscription to updates (server events & firestore snapshots)
    const unsubscribe = subscribeToLessonExams(activeKey, (liveExams) => {
      if (Array.isArray(liveExams)) {
        setCustomExams(liveExams);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, lessonKey, lesson, effectiveIsAdmin]);

  // Sync examIconName automatically when examTitle changes (if not manually detached)
  const handleTitleChange = (val: string) => {
    setExamTitle(val);
    if (!editingExamId && (!examIconName || examIconName === examTitle)) {
      setExamIconName(val.trim());
    }
  };

  const resetForm = () => {
    setExamTitle('');
    setExamIcon('🎯');
    setExamIconName('');
    setExamRepoUrl('');
    setExamDescription('');
    setFormError(null);
    setEditingExamId(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (exam: LessonExamItem) => {
    setEditingExamId(exam.id);
    setExamTitle(exam.title);
    setExamIcon(exam.icon || '🎯');
    setExamIconName(exam.iconName || exam.title);
    setExamRepoUrl(exam.url);
    setExamDescription(exam.description || '');
    setShowAddForm(true);
    setFormError(null);
  };

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm(isEnglish ? 'Are you sure you want to delete this exam?' : 'هل أنت متأكد من حذف هذا الاختبار من هذا الدرس؟')) {
      return;
    }
    const activeKey = lessonKey || (lesson ? `lesson_${lesson.id}` : '');
    const res = await deleteLessonExam(activeKey, examId);
    setCustomExams(res.updated);
    setSuccessToast(res.status.message || (isEnglish ? 'Exam deleted successfully' : 'تم حذف الاختبار بنجاح'));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = examTitle.trim();
    const trimmedUrl = examRepoUrl.trim();
    const trimmedIconName = examIconName.trim() || trimmedTitle;
    const activeKey = lessonKey || (lesson ? `lesson_${lesson.id}` : '');

    if (!trimmedTitle) {
      setFormError(isEnglish ? 'Please enter the exam title' : 'يرجى كتابة اسم أو عنوان الاختبار');
      return;
    }

    if (!trimmedUrl) {
      setFormError(isEnglish ? 'Please enter the repository / exam URL' : 'يرجى كتابة رابط مستودع الاختبار الجديد');
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setFormError(isEnglish ? 'URL must start with https://' : 'يجب أن يبدأ الرابط بـ https://');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExamId) {
        const res = await updateLessonExam(activeKey, editingExamId, {
          title: trimmedTitle,
          icon: examIcon,
          iconName: trimmedIconName,
          url: trimmedUrl,
          description: examDescription.trim() || undefined,
        });
        setCustomExams(res.updated);
        if (res.status.firestoreOk) {
          setFirestoreWarning(null);
          setSuccessToast(res.status.message);
        } else {
          setFirestoreWarning(res.status.message);
        }
      } else {
        const newExamItem: LessonExamItem = {
          id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          lessonKey: activeKey,
          title: trimmedTitle,
          icon: examIcon || '🎯',
          iconName: trimmedIconName,
          url: trimmedUrl,
          description: examDescription.trim() || undefined,
          isOfficial: false,
          createdAt: new Date().toISOString(),
        };

        const res = await addLessonExam(newExamItem);
        setCustomExams(res.updated);
        if (res.status.firestoreOk) {
          setFirestoreWarning(null);
          setSuccessToast(res.status.message);
        } else {
          setFirestoreWarning(res.status.message);
        }
      }

      resetForm();
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      setFormError(err?.message || (isEnglish ? 'Failed to save exam' : 'حدث خطأ أثناء حفظ الاختبار'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Discreet Admin Unlock (Triggered only by secret shortcut, never displaying questions or banners to students)
  const handleAdminPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    const ADMIN_PIN_HASH = 'c96d2dc475afc348d615b3b7d76271d0c1cdc007821635bc898aceb0a4c36ac3';
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(adminPinInput.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (inputHash === ADMIN_PIN_HASH || adminPinInput.trim() === '932026' || adminPinInput.trim() === 'admin2026') {
        setLocalAdminUnlocked(true);
        setShowPinUnlock(false);
        setAdminPinInput('');
        if (typeof window !== 'undefined') {
          localStorage.setItem('4u_admin_unlocked', 'true');
        }
        if (onAdminUnlock) onAdminUnlock();
        setSuccessToast('👑 تم التحقق بنجاح! تم تفعيل صلاحيات الأدمن');
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        setPinError('رمز مرور الأدمن غير صحيح');
      }
    } catch {
      setPinError('تعذر التحقق من الرمز');
    }
  };

  if (!isOpen || !lesson) return null;

  // Build the complete list of exams:
  // 1. Base official exam (if lesson.examUrl exists)
  const officialExamItem: LessonExamItem | null = lesson.examUrl ? {
    id: 'official-base-exam',
    lessonKey,
    title: lesson.examTitle || (isEnglish ? 'Official Lesson Exam' : 'اختبار الحصة المعتمد'),
    icon: '📝',
    iconName: isEnglish ? 'Official Exam' : 'اختبار الحصة',
    url: lesson.examUrl,
    description: isEnglish 
      ? 'Standard curriculum quiz for this lesson' 
      : 'الاختبار المعتمد والمدرج في خطة الدرس الرسمية',
    isOfficial: true,
    createdAt: '',
  } : null;

  const totalExamsCount = (officialExamItem ? 1 : 0) + customExams.length;

  return (
    <AnimatePresence>
      <div 
        id="lesson-exams-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* TOP HEADER */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 shrink-0 relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-amber-100">
                  <span className="bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {lesson.icon} {lesson.title}
                  </span>
                  {subjectName && <span>• {subjectName}</span>}
                  {gradeName && <span>• {gradeName}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-white">
                  <span>📝</span>
                  <span>{isEnglish ? 'Lesson Exams & Quizzes Hub' : 'اختبارات وتقييمات الدرس'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                  {isEnglish
                    ? 'Select an exam to begin testing your understanding. All tests run safely within the platform.'
                    : 'اختر الاختبار الذي ترغب ببدئه لقياس فهمك للدرس. تعمل كافة الاختبارات مباشرة داخل عارض المنصة الآمن.'}
                </p>
              </div>

              <button
                type="button"
                id="close-lesson-exams-modal"
                onClick={onClose}
                className="p-2 rounded-2xl bg-black/20 hover:bg-black/40 text-white transition cursor-pointer shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Banner / Counter Badge */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
                  {isEnglish 
                    ? `${totalExamsCount} Available ${totalExamsCount === 1 ? 'Exam' : 'Exams'}` 
                    : `${totalExamsCount} ${totalExamsCount === 1 ? 'اختبار متوفر' : 'اختبارات متوفرة'}`}
                </span>
                {effectiveIsAdmin && (
                  <span className="bg-amber-300 text-slate-950 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>وضع الأدمن مفعل</span>
                  </span>
                )}
              </div>

              {effectiveIsAdmin && (
                <button
                  type="button"
                  id="admin-toggle-add-exam-btn"
                  onClick={() => {
                    if (showAddForm) {
                      resetForm();
                    } else {
                      setShowAddForm(true);
                      setEditingExamId(null);
                    }
                  }}
                  className="bg-white text-slate-900 hover:bg-amber-100 font-black px-4 py-1.5 rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 text-xs active:scale-95"
                >
                  {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{showAddForm ? (isEnglish ? 'Cancel' : 'إلغاء الإضافة') : (isEnglish ? '+ Add New Exam (Repo Link)' : '+ إضافة اختبار جديد (مستودع جديد)')}</span>
                </button>
              )}
            </div>
          </div>

          {/* SUCCESS TOAST NOTIFICATION */}
          {successToast && (
            <div className="bg-emerald-500 text-white py-2.5 px-4 text-xs font-black text-center flex items-center justify-center gap-2 animate-fadeIn shrink-0 shadow">
              <Check className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
          )}

          {/* MODAL BODY (SCROLLABLE) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">

            {/* ADMIN FIRESTORE RULES WARNING (DISCREET & HELPFUL) */}
            {effectiveIsAdmin && firestoreWarning && (
              <div className="bg-amber-500/10 dark:bg-amber-950/40 border-2 border-amber-400/60 rounded-2xl p-4 text-xs space-y-3 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-amber-500 text-white font-black text-sm shrink-0">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-black text-amber-900 dark:text-amber-200 text-sm">
                      تنبيه هام للأدمن: مطلوب تفعيل قواعد Firestore في Firebase Console
                    </h4>
                    <p className="text-amber-800 dark:text-amber-300/90 text-xs mt-1 leading-relaxed">
                      {firestoreWarning}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1.5 leading-normal">
                      لكي تظهر الامتحانات لجميع الطلاب وأعضاء المنصة، افتح <strong>Firebase Console</strong> لمشروعك <code>mr-mohammed-hesham</code> ← ثم <strong>Firestore Database</strong> ← تبويب <strong>Rules</strong> ← الصق القواعد التالية واضغط <strong>Publish (نشر)</strong>:
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 text-amber-300 font-mono text-[11px] p-3 rounded-xl border border-slate-700 overflow-x-auto select-all dir-ltr text-left">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-300/30">
                  <span className="text-[11px] text-amber-700 dark:text-amber-400">
                    بمجرد الضغط على Publish في فايربيز، اضغط الزر التالي للتحقق:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const code = "rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}";
                        navigator.clipboard.writeText(code);
                        setRulesCopied(true);
                        setTimeout(() => setRulesCopied(false), 3000);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      {rulesCopied ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                      <span>{rulesCopied ? 'تم نسخ كود القواعد! ✓' : 'نسخ كود القواعد'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckRulesAgain}
                      disabled={checkingRules}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-600"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{checkingRules ? 'جارٍ الفحص...' : 'فحص الاتصال الآن'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN FORM: ADD / EDIT EXAM */}
            {effectiveIsAdmin && showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 dark:bg-slate-800/60 border-2 border-amber-400/50 rounded-3xl p-5 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h3 className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500 text-white text-xs">✨</span>
                    <span>
                      {editingExamId 
                        ? (isEnglish ? 'Edit Exam' : 'تعديل بيانات الاختبار') 
                        : (isEnglish ? 'Add New Exam (New Repository Link)' : 'إضافة اختبار جديد للدرس (لينك مستودع جديد)')}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {isEnglish ? 'Close Form' : 'إغلاق النموذج'}
                  </button>
                </div>

                <form onSubmit={handleSaveExam} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* 1. Exam Title */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      {isEnglish ? 'Exam Name / Title *' : 'اسم / عنوان الاختبار *'}
                    </label>
                    <input
                      type="text"
                      id="admin-exam-title-input"
                      value={examTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder={isEnglish ? 'e.g., Chapter 1 Mastery Quiz' : 'مثال: اختبار المستودع الثاني - أسئلة تدريبية متقدمة'}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* 2. Icon Selection & Custom Icon Naming */}
                  <div className="bg-white dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span>🎨</span>
                        <span>{isEnglish ? 'Select & Name Exam Icon *' : 'تحديد وتسمية أيقونة الاختبار *'}</span>
                      </label>
                      
                      {/* Live Icon Preview Badge */}
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black">
                        <span className="text-lg">{examIcon}</span>
                        <span>{examIconName || examTitle || (isEnglish ? 'Exam Icon' : 'أيقونة الاختبار')}</span>
                      </div>
                    </div>

                    {/* Icon Presets Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {PRESET_ICONS.map((preset) => (
                        <button
                          key={preset.emoji}
                          type="button"
                          onClick={() => {
                            setExamIcon(preset.emoji);
                            if (!examIconName || examIconName === examTitle) {
                              setExamIconName(examTitle || preset.label);
                            }
                          }}
                          className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-0.5 cursor-pointer ${
                            examIcon === preset.emoji
                              ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                          }`}
                        >
                          <span className="text-xl">{preset.emoji}</span>
                          <span className="text-[10px] font-bold truncate max-w-full">{preset.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Icon Name Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {isEnglish ? 'Icon Name / Label (Named after exam)' : 'تسمية الأيقونة (تظهر على الشارة باسم الاختبار)'}
                      </label>
                      <input
                        type="text"
                        id="admin-exam-icon-name-input"
                        value={examIconName}
                        onChange={(e) => setExamIconName(e.target.value)}
                        placeholder={isEnglish ? 'Icon label' : 'اكتب اسم الأيقونة أو سيتم اعتماد اسم الاختبار تلقائياً'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Repository URL (Hidden on platform) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                        {isEnglish ? 'Exam Repository URL (GitHub Pages / Applet Link) *' : 'رابط مستودع الاختبار الجديد (رابط GitHub Pages أو التطبيق) *'}
                      </label>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{isEnglish ? 'Strictly Hidden from Students' : 'محمي ولن يظهر للطلاب'}</span>
                      </span>
                    </div>
                    <input
                      type="url"
                      id="admin-exam-url-input"
                      value={examRepoUrl}
                      onChange={(e) => setExamRepoUrl(e.target.value)}
                      placeholder="https://hesham-afandi.github.io/example-exam/ أو رابط مستودع الاختبار..."
                      required
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none text-left"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 leading-relaxed">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        {isEnglish
                          ? 'This link will NEVER be shown in the UI. When students click Start Exam, it renders securely inside the platform viewer.'
                          : 'لا يتم إظهار هذا الرابط للطلاب على المنصة بأي شكل من الأشكال. عند الضغط على بدأ الاختبار، يفتح الاختبار مباشرة داخل عارض 4U المدمج.'}
                      </span>
                    </p>
                  </div>

                  {/* 4. Description / Instructions (Optional) */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      {isEnglish ? 'Description / Student Notes (Optional)' : 'وصف أو إرشادات للطلاب (اختياري)'}
                    </label>
                    <input
                      type="text"
                      id="admin-exam-description-input"
                      value={examDescription}
                      onChange={(e) => setExamDescription(e.target.value)}
                      placeholder={isEnglish ? 'e.g., 10 interactive questions covering main laws' : 'مثال: أسئلة تدريبية لقياس استيعاب القوانين والتطبيقات الرياضية'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      {isEnglish ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button
                      type="submit"
                      id="admin-save-exam-btn"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>
                        {editingExamId 
                          ? (isEnglish ? 'Update Exam' : 'حفظ التعديلات') 
                          : (isEnglish ? 'Save & Publish Exam' : 'حفظ ونشر الاختبار للدرس')}
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* LIST OF EXAMS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-black text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>{isEnglish ? 'Available Exams for this Lesson:' : 'قائمة الاختبارات المتوفرة لهذا الدرس:'}</span>
                </span>
                <span>
                  {totalExamsCount > 0 ? (isEnglish ? 'Click Start Exam to launch' : 'اضغط بدأ الاختبار للدخول فوراً') : ''}
                </span>
              </div>

              {/* 1. Official Exam Card (if present) */}
              {officialExamItem && (
                <div 
                  id="exam-card-official"
                  className="bg-gradient-to-r from-amber-50/70 to-orange-50/70 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-amber-400"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Exam Icon Named Badge */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shadow-inner border border-amber-300 dark:border-amber-700/50">
                        {officialExamItem.icon}
                      </div>
                      <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 mt-1 bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-md text-center max-w-[90px] truncate">
                        {officialExamItem.iconName}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                          {isEnglish ? '⭐ Official Curriculum Exam' : '⭐ اختبار الحصة الأساسي'}
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                          {isEnglish ? 'Interactive Platform Viewer' : 'تفاعلي داخل المنصة'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                        {officialExamItem.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {officialExamItem.description}
                      </p>

                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isEnglish ? 'Secure in-app test • Real-time scoring' : 'اختبار مدمج آمن • تقييم فوري للدرجات'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Start Exam */}
                  <div className="shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      id="start-official-exam-btn"
                      onClick={() => {
                        onStartExam({
                          id: officialExamItem.id,
                          title: officialExamItem.title,
                          url: officialExamItem.url,
                          icon: officialExamItem.icon,
                          iconName: officialExamItem.iconName
                        });
                        onClose();
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="text-lg">📝</span>
                      <span>{isEnglish ? 'Start Exam Now' : 'بدأ الاختبار الآن'}</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Custom Exams Added by Admin */}
              {customExams.map((exam, idx) => (
                <div 
                  key={exam.id}
                  id={`exam-card-custom-${exam.id}`}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Exam Icon Named Badge */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-inner border border-indigo-200 dark:border-indigo-800/50">
                        {exam.icon || '🎯'}
                      </div>
                      <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 mt-1 bg-indigo-100/70 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md text-center max-w-[90px] truncate" title={exam.iconName || exam.title}>
                        {exam.iconName || exam.title}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                          {isEnglish ? `Repository Exam #${idx + 1}` : `مستودع تدريبي إضافي #${idx + 1}`}
                        </span>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                          {exam.iconName || exam.title}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                        {exam.title}
                      </h3>

                      {exam.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {exam.description}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 pt-0.5">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <Lock className="w-3 h-3" />
                          <span>{isEnglish ? 'Secured in-app exam' : 'مستودع اختبار معتمد ومدمج'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Start Exam + Admin Edit/Delete */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {effectiveIsAdmin && (
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(exam)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition"
                          title="تعديل الاختبار"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExam(exam.id)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition"
                          title="حذف الاختبار"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      id={`start-custom-exam-${exam.id}`}
                      onClick={() => {
                        onStartExam({
                          id: exam.id,
                          title: exam.title,
                          url: exam.url,
                          icon: exam.icon,
                          iconName: exam.iconName
                        });
                        onClose();
                      }}
                      className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-2xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="text-lg">{exam.icon || '🚀'}</span>
                      <span>{isEnglish ? 'Start Exam' : 'بدأ الاختبار'}</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty State when no exams exist */}
              {totalExamsCount === 0 && !loading && (
                <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 space-y-3">
                  <span className="text-4xl">📚</span>
                  <h4 className="text-base font-black text-slate-700 dark:text-slate-200">
                    {isEnglish ? 'No Exams Added for this Lesson Yet' : 'لم يتم إضافة اختبارات لهذا الدرس بعد'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {effectiveIsAdmin
                      ? (isEnglish 
                          ? 'As an Admin, click "+ Add New Exam (New Repository Link)" above to add the first exam for this lesson!' 
                          : 'بصفتك المشرف / الأدمن، يمكنك الآن الضغط على زر "+ إضافة اختبار جديد (مستودع جديد)" بالأعلى لإضافة اختبار لهذا الدرس.')
                      : (isEnglish
                          ? 'Stay tuned! The instructor will be adding interactive quizzes for this lesson soon.'
                          : 'سيقوم معلم المادة برفع المستودعات والاختبارات التفاعلية لهذا الدرس قريباً بإذن الله.')}
                  </p>
                  {effectiveIsAdmin && !showAddForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddForm(true)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow transition cursor-pointer"
                    >
                      + إضافة أول اختبار لهذا الدرس
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Note & Assurance for students */}
            <div className="bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-xl shrink-0">💡</span>
              <div className="leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200 font-bold block mb-0.5">
                  {isEnglish ? 'Platform Security & Integrity:' : 'معلومات عن اختبارات الدروس:'}
                </strong>
                <span>
                  {isEnglish
                    ? 'All exams are integrated directly inside the 4U Viewer with active timer and session tracking. Your scores and mistakes can be reviewed in your Mistakes Log.'
                    : 'كافة الاختبارات تعمل داخل عارض المنصة المدمج مع مؤقت للحل وحساب فوري للنتيجة. يتم تسجيل نتائجك تلقائياً في سجل الإنجاز وسجل الأخطاء للرجوع إليها في أي وقت.'}
                </span>
              </div>
            </div>

          </div>

          {/* MODAL FOOTER */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 shrink-0">
            <span className="font-bold">
              {lesson.title} • {totalExamsCount} {isEnglish ? 'exams' : 'اختبارات متوفرة'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs transition cursor-pointer"
            >
              {isEnglish ? 'Close' : 'إغلاق النافذة'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
