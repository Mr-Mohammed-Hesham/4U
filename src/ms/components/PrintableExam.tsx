import React from 'react';
import { StudentInfo } from '../types';
import { EXAM_MODULES } from '../data/examData';
import { PPT_EXAM_MODULES } from '../data/powerpointExamData';
import { EXCEL_EXAM_MODULES } from '../data/excelExamData';
import { ACCESS_EXAM_MODULES } from '../data/accessExamData';
import { Printer } from 'lucide-react';

interface PrintableExamProps {
  studentInfo: StudentInfo;
  earnedPoints: number;
  totalPoints: number;
  selectedApp?: 'word' | 'excel' | 'powerpoint' | 'access';
}

export const PrintableExam: React.FC<PrintableExamProps> = ({
  studentInfo,
  earnedPoints,
  totalPoints,
  selectedApp = 'word',
}) => {
  const handlePrint = () => {
    window.print();
  };

  const activeModules = 
    selectedApp === 'excel' ? EXCEL_EXAM_MODULES :
    selectedApp === 'powerpoint' ? PPT_EXAM_MODULES :
    selectedApp === 'access' ? ACCESS_EXAM_MODULES :
    EXAM_MODULES;

  const appTitle = 
    selectedApp === 'excel' ? 'Microsoft Excel Practical Exam' :
    selectedApp === 'powerpoint' ? 'Microsoft PowerPoint Practical Exam' :
    selectedApp === 'access' ? 'Microsoft Access Relational Database Exam' :
    'Microsoft Word Practical Exam';

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen py-6 px-4" dir="ltr">
      
      {/* Print Trigger Floating Bar */}
      <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 shadow-md flex items-center justify-between no-print">
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Official Printable Paper Exam Format ({selectedApp === 'excel' ? 'Excel' : selectedApp === 'access' ? 'Access' : selectedApp === 'powerpoint' ? 'PowerPoint' : 'Word'})</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ready for instant printing and physical distribution to exam hall candidates.</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Paper Exam (PDF)</span>
        </button>
      </div>

      {/* Official Exam Sheet Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-12 border-2 border-slate-900 dark:border-slate-700 shadow-xl text-slate-900 dark:text-slate-100 font-sans print:p-6 print:border-black print:shadow-none print:bg-white print:text-black">
        
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 print:border-black pb-6 mb-6">
          <div className="flex items-start justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black leading-relaxed">
            <div className="text-left">
              <div>Course: {appTitle}</div>
              <div>Assessment Mode: Hands-On Simulator</div>
            </div>

            <div className="text-center px-4">
              <div className="w-16 h-16 mx-auto mb-1 border-2 border-slate-800 dark:border-slate-600 print:border-black rounded-full flex items-center justify-center font-black text-lg bg-slate-50 dark:bg-slate-800 print:bg-white">
                {selectedApp === 'excel' ? 'XLS' : selectedApp === 'access' ? 'ACC' : selectedApp === 'powerpoint' ? 'PPT' : 'MS'}
              </div>
              <span className="text-xs block text-slate-600 dark:text-slate-400 print:text-black font-mono">
                {selectedApp === 'excel' ? 'Excel 2026' : selectedApp === 'access' ? 'Access 2026' : selectedApp === 'powerpoint' ? 'PPT 2026' : 'Word 2026'}
              </span>
            </div>

            <div className="text-right">
              <div>Subject: {selectedApp === 'excel' ? 'Microsoft Excel' : selectedApp === 'access' ? 'Microsoft Access' : selectedApp === 'powerpoint' ? 'Microsoft PowerPoint' : 'Microsoft Word'}</div>
              <div>Exam Duration: 60 Minutes</div>
              <div>Total Marks: 100 Points</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 print:text-black uppercase tracking-tight">
              Comprehensive Practical Examination - {selectedApp === 'excel' ? 'Microsoft Excel' : selectedApp === 'access' ? 'Microsoft Access' : selectedApp === 'powerpoint' ? 'Microsoft PowerPoint' : 'Microsoft Word'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 print:text-black font-semibold mt-1">
              Academic Year 2025/2026 - Final Practical Term
            </p>
          </div>
        </div>

        {/* Student Info Box & Grade Stamp Header */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-50 border border-slate-800 dark:border-slate-700 print:border-black rounded-lg text-xs font-semibold mb-6">
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Student Full Name:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 print:text-black text-sm">{studentInfo.name || '...................................................'}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Seat / Academic ID:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 print:text-black font-mono">{studentInfo.seatNumber || '...................'}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Group / Date:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 print:text-black">{studentInfo.group} - {studentInfo.date}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 print:bg-white p-2 border border-slate-800 dark:border-slate-700 print:border-black rounded text-center">
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block text-[10px]">Score Earned:</span>
            <span className="font-black text-base text-blue-900 dark:text-blue-300 print:text-black font-mono">{earnedPoints} / {totalPoints}</span>
          </div>
        </div>

        {/* Exam General Instructions */}
        <div className="mb-6 text-xs text-slate-800 dark:text-slate-200 print:text-black bg-slate-100 dark:bg-slate-800/80 print:bg-slate-100 p-3 rounded border border-slate-300 dark:border-slate-700 print:border-slate-300">
          <strong className="block text-slate-900 dark:text-slate-100 print:text-black mb-1">Important Candidate Guidelines:</strong>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open a new {selectedApp === 'excel' ? 'Microsoft Excel spreadsheet' : selectedApp === 'access' ? 'Microsoft Access database' : selectedApp === 'powerpoint' ? 'Microsoft PowerPoint presentation' : 'Microsoft Word document'} on your PC, save it with your name & seat ID on Desktop.</li>
            <li>Copy the raw text and dataset from the Data Pack and implement all tasks in exact order.</li>
            <li>Ensure full compliance with specified ribbon paths, font sizes, margins, colors, and layout dimensions.</li>
          </ol>
        </div>

        {/* Exam Modules and Questions */}
        <div className="space-y-6">
          {activeModules.map(module => (
            <div key={module.id} className="border border-slate-800 rounded-lg p-4 bg-white page-break-inside-avoid">
              
              {/* Module Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-slate-800">
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Module {module.moduleNumber}: {module.title}
                </h3>
                <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded">
                  {module.totalPoints} Points
                </span>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-3">
                {module.tasks.map((task, tIdx) => (
                  <div key={task.id} className="text-xs p-2.5 bg-slate-50 rounded border border-slate-300">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-900 shrink-0">
                          Q {module.moduleNumber}.{tIdx + 1}:
                        </span>
                        <div>
                          <strong className="text-slate-900 font-bold block mb-0.5">{task.title}</strong>
                          <p className="text-slate-700 leading-relaxed">{task.description}</p>
                          <div className="mt-1 text-[11px] font-mono text-slate-600">
                            Ribbon Command Path: {task.wordPath}
                          </div>
                        </div>
                      </div>

                      {/* Grade Box for Evaluator */}
                      <div className="shrink-0 text-center border border-slate-800 bg-white p-1 rounded min-w-16">
                        <span className="text-[9px] text-slate-500 block">Marks ({task.points})</span>
                        <div className="h-5 border-t border-slate-300 font-mono font-bold text-slate-900 pt-0.5">
                          [ &nbsp; &nbsp; ]
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Evaluation Sign-off Table */}
        <div className="mt-8 pt-6 border-t-2 border-slate-900 page-break-inside-avoid">
          <h3 className="font-bold text-xs text-slate-900 mb-3 text-center">
            Examiners & Reviewers Final Evaluation Sign-off
          </h3>
          <table className="w-full text-xs text-center border-collapse border border-slate-900">
            <thead>
              <tr className="bg-slate-100 font-bold">
                <th className="border border-slate-900 p-2 text-left">Module Title</th>
                <th className="border border-slate-900 p-2">Max Points</th>
                <th className="border border-slate-900 p-2">Score Awarded</th>
                <th className="border border-slate-900 p-2">Examiner Signature</th>
              </tr>
            </thead>
            <tbody>
              {activeModules.map(m => (
                <tr key={m.id}>
                  <td className="border border-slate-900 p-1.5 font-bold text-left">Module {m.moduleNumber} ({m.title})</td>
                  <td className="border border-slate-900 p-1.5">{m.totalPoints}</td>
                  <td className="border border-slate-900 p-1.5 font-mono font-bold"></td>
                  <td className="border border-slate-900 p-1.5"></td>
                </tr>
              ))}
              <tr className="bg-slate-200 font-black">
                <td className="border border-slate-900 p-2 text-left">Comprehensive Final Score</td>
                <td className="border border-slate-900 p-2">100 Pts</td>
                <td className="border border-slate-900 p-2 font-mono text-base">{earnedPoints}</td>
                <td className="border border-slate-900 p-2 font-mono">Instructor Signature</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-end mt-8 text-xs font-bold text-slate-800 pt-4">
            <div>
              <div>Candidate Attendance Signature:</div>
              <div className="mt-4 border-b border-slate-500 w-48" />
            </div>
            <div>
              <div>Department Head Signature & Stamp:</div>
              <div className="mt-4 border-b border-slate-500 w-48 text-center font-mono text-slate-400">...................................</div>
            </div>
          </div>
        </div>

        {/* Printable Paper Footer Signature */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div>Microsoft Word Practical Exam • Official Assessment Sheet</div>
          <div className="font-bold text-slate-900">Created by: Mr. Mohammed Hesham</div>
        </div>

      </div>
    </div>
  );
};
