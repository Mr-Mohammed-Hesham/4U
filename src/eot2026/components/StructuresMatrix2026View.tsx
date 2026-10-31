import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  Eot2026Curriculum,
  Eot2026TermId,
  EotLanguage,
  EotQuestionProbeResult,
} from '../types';
import {
  EOT2026_TERMS,
  getGradeLabel2026,
  getStreamLabel2026,
  getSubjectLabel2026,
} from '../eot2026LiveService';

interface StructuresMatrix2026ViewProps {
  curricula: Eot2026Curriculum[];
  onSwitchTo2025: () => void;
  selectedTerm: Eot2026TermId;
  onTermChange: (term: Eot2026TermId) => void;
  getTotalQuestions: (curriculum: Eot2026Curriculum) => number;
  completedMap: Record<string, number[]>;
  probeMap: Record<string, Record<number, EotQuestionProbeResult>>;
  isScanningAll: boolean;
  onScanAllCurricula: () => void;
  onOpenCurriculumQuestion: (curriculumId: string, qNumber: number) => void;
  language: EotLanguage;
}

export const StructuresMatrix2026View: React.FC<StructuresMatrix2026ViewProps> = ({
  curricula,
  onSwitchTo2025,
  selectedTerm,
  onTermChange,
  getTotalQuestions,
  completedMap,
  probeMap,
  isScanningAll,
  onScanAllCurricula,
  onOpenCurriculumQuestion,
  language,
}) => {
  const isEn = language === 'en';
  const ArrowIcon = isEn ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {isEn
              ? '2026 Exam Structures Matrix & Live Coverage'
              : 'مصفوفة هياكل 2026 الشاملة ومتابعة الأسئلة المتاحة'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Real-time overview of all approved curricula, published question pages, and your study progress.'
              : 'جدول متابعة حي لجميع مناهج هياكل 2026، عدد صفحات الأسئلة المنشورة حالياً، ونسبة إنجازك في المراجعة.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label={isEn ? 'Academic Year' : 'السنة الدراسية'}
            value="2026"
            onChange={(e) => {
              if (e.target.value === '2025') onSwitchTo2025();
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 tabular-nums cursor-pointer"
          >
            <option value="2026">{isEn ? '2026 Structures' : 'هياكل 2026'}</option>
            <option value="2025">{isEn ? '2025 Archive' : 'هياكل 2025'}</option>
          </select>

          <select
            aria-label={isEn ? 'Term' : 'الفصل الدراسي'}
            value={selectedTerm}
            onChange={(e) => onTermChange(e.target.value as Eot2026TermId)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            {EOT2026_TERMS.map((t) => (
              <option key={t.id} value={t.id}>
                {isEn ? t.labelEn : t.labelAr}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onScanAllCurricula}
            disabled={isScanningAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-bold disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>{isEn ? 'Verify Live Pages' : 'فحص وتحديث جميع المناهج'}</span>
          </button>
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-xs font-bold text-slate-600 dark:text-slate-300">
                <th className="py-3.5 px-4 text-start">{isEn ? 'Curriculum' : 'المنهج الدراسي'}</th>
                <th className="py-3.5 px-4 text-start">{isEn ? 'Grade & Stream' : 'الصف والمسار'}</th>
                <th className="py-3.5 px-4 text-start">{isEn ? 'Subject' : 'المادة'}</th>
                <th className="py-3.5 px-4 text-start">
                  {isEn ? 'Exam Structure' : 'توزيع أقسام الهيكل'}
                </th>
                <th className="py-3.5 px-4 text-end tabular-nums">{isEn ? 'Pages' : 'الصفحات'}</th>
                <th className="py-3.5 px-4 text-end tabular-nums">
                  {isEn ? 'Available Now' : 'المتاح حالياً'}
                </th>
                <th className="py-3.5 px-4 text-end tabular-nums">
                  {isEn ? 'Reviewed' : 'تمت مراجعته'}
                </th>
                <th className="py-3.5 px-4 text-end">{isEn ? 'Action' : 'الإجراء'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {curricula.map((c) => {
                const totalQ = getTotalQuestions(c);
                const doneCount = (completedMap[c.id] || []).filter((q) => q <= totalQ).length;
                const probeValues = Object.values(probeMap[c.id] || {}) as EotQuestionProbeResult[];
                const liveCount = probeValues.filter((p) => p.status === 'live').length;
                const checkedCount = probeValues.filter(
                  (p) => p.status === 'live' || p.status === 'pending'
                ).length;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {isEn ? c.titleEn : c.titleAr}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <span>{getGradeLabel2026(c.grade, language)}</span>
                      <span className="mx-1.5" aria-hidden="true">
                        ·
                      </span>
                      <span>{getStreamLabel2026(c.stream, language)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200 font-semibold whitespace-nowrap">
                      {getSubjectLabel2026(c.subject, language)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap tabular-nums">
                      {isEn
                        ? `${c.mcqQuestionsEnd} MCQ + ${Math.max(0, totalQ - c.mcqQuestionsEnd)} Written`
                        : `${c.mcqQuestionsEnd} موضوعي + ${Math.max(0, totalQ - c.mcqQuestionsEnd)} مقالي`}
                    </td>
                    <td className="py-3.5 px-4 text-end font-mono font-bold tabular-nums whitespace-nowrap">
                      {totalQ}
                    </td>
                    <td className="py-3.5 px-4 text-end tabular-nums whitespace-nowrap">
                      {liveCount > 0 ? (
                        <span className="inline-flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {liveCount} {isEn ? 'live' : 'سؤال متاح'}
                          </span>
                        </span>
                      ) : checkedCount > 0 ? (
                        <span className="text-slate-400 dark:text-slate-500">
                          {isEn ? 'In preparation' : 'قيد الإعداد'}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-end font-mono tabular-nums whitespace-nowrap">
                      {doneCount} / {totalQ}
                    </td>
                    <td className="py-3.5 px-4 text-end whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenCurriculumQuestion(c.id, 1)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold transition-colors cursor-pointer"
                      >
                        <span>{isEn ? 'Open Q1' : 'فتح الأسئلة'}</span>
                        <ArrowIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
