import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../types';
import { QuestionCard } from './QuestionCard';
import { translations, Language } from '../data/translations';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PracticeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
  language?: Language;
}

export const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({
  isOpen,
  onClose,
  questions,
  bookmarkedIds,
  onToggleBookmark,
  language = 'ar',
}) => {
  const t = translations[language];
  const isRTL = language === 'ar';
  const [selectedModule, setSelectedModule] = useState<'all' | 1 | 2>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes per module standard
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const filteredQuestions = questions.filter((q) => {
    if (selectedModule === 'all') return true;
    return q.module === selectedModule;
  });

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Timer effect
  useEffect(() => {
    if (!isOpen || isSubmitted || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted, isTimerRunning]);

  // Reset when module changes
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimeLeft(selectedModule === 'all' ? 70 * 60 : 35 * 60);
    setIsTimerRunning(true);
  }, [selectedModule, isOpen]);

  if (!isOpen) return null;

  const handleAnswer = (qId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: answer,
    }));
  };

  const handleFinishTest = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleRestart = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(selectedModule === 'all' ? 70 * 60 : 35 * 60);
    setIsTimerRunning(true);
  };

  // Score Calculations
  let correctCount = 0;
  filteredQuestions.forEach((q) => {
    const userAns = userAnswers[q.id];
    if (!userAns) return;
    if (q.format === 'MCQ' && userAns === q.correctAnswer) {
      correctCount++;
    } else if (
      q.format === 'SPR' &&
      q.acceptableAnswers?.some(
        (ans) => ans.trim().toLowerCase() === userAns.trim().toLowerCase()
      )
    ) {
      correctCount++;
    }
  });

  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = filteredQuestions.length;
  const percentage = Math.round((correctCount / totalCount) * 100) || 0;

  // Format Time Remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white">{t.quizModalTitle}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>
                  {t.quizQuestionOf} <strong>{currentIndex + 1}</strong> {t.quizScoreOutOf}{' '}
                  <strong>{totalCount}</strong>
                </span>
                <span>&bull;</span>
                <span className="text-indigo-300">
                  {language === 'ar' ? `تم حل ${answeredCount} من ${totalCount}` : `Answered ${answeredCount} of ${totalCount}`}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-sm font-bold border ${
              timeLeft < 300
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
            dir="ltr"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Right: Module Select & Close */}
          <div className="flex items-center gap-2">
            {!isSubmitted && (
              <button
                onClick={handleFinishTest}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                {t.quizSubmitExam}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* If Submitted: Show Results Summary Card */}
          {isSubmitted && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500 flex items-center justify-center mx-auto text-indigo-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{t.quizScoreSummary}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  {language === 'ar' ? 'تم تصحيح إجاباتك بمطابقتها لمفتاح الإجابة الرسمي' : 'Your answers have been graded against the official answer key'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    {correctCount} / {totalCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'الإجابات الصحيحة' : 'Correct Answers'}
                  </div>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-300 font-mono">{percentage}%</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {language === 'ar' ? 'النسبة المئوية' : 'Accuracy Score'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.quizRestart}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Question Render */}
          {activeQuestion && (
            <div className="space-y-4">
              <QuestionCard
                question={activeQuestion}
                viewMode={isSubmitted ? 'study' : 'quiz'}
                isBookmarked={bookmarkedIds.has(activeQuestion.id)}
                onToggleBookmark={onToggleBookmark}
                userAnswer={userAnswers[activeQuestion.id]}
                onAnswer={handleAnswer}
                showQuizResults={isSubmitted}
                language={language}
              />
            </div>
          )}
        </div>

        {/* Modal Bottom Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Question Grid Navigator */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-xl pb-1 scrollbar-none">
            {filteredQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAns = Boolean(userAnswers[q.id]);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : hasAns
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <PrevIcon className="w-4 h-4" />
              <span>{t.quizPrev}</span>
            </button>

            <button
              disabled={currentIndex === filteredQuestions.length - 1}
              onClick={() =>
                setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>{t.quizNext}</span>
              <NextIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
