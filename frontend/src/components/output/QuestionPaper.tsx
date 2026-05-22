"use client";

import { Download, RefreshCcw } from 'lucide-react';
import StudentInfoSection from './StudentInfoSection';
import DifficultyBadge from './DifficultyBadge';

interface QuestionPaperProps {
  result: any;
  isLoading?: boolean;
  onDownload?: () => void;
  onRegenerate?: () => void;
  hideBadges?: boolean;
}

export default function QuestionPaper({ result, isLoading, onDownload, onRegenerate, hideBadges }: QuestionPaperProps) {
  if (isLoading || !result) {
    return (
      <div className="max-w-[800px] mx-auto bg-brand-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 animate-pulse">
          {/* Skeleton Header */}
          <div className="h-8 bg-brand-bg rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-brand-bg rounded w-1/2 mx-auto mb-8"></div>
          
          <div className="flex justify-between border-b-2 border-border pb-4 mb-8">
            <div className="h-5 bg-brand-bg rounded w-1/4"></div>
            <div className="h-5 bg-brand-bg rounded w-1/4"></div>
          </div>
          
          <div className="h-4 bg-brand-bg rounded w-2/3 mx-auto mb-10"></div>
          
          {/* Skeleton Sections */}
          {[1, 2, 3].map((sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <div className="h-6 bg-brand-bg rounded w-1/3 mx-auto mb-2"></div>
              <div className="h-4 bg-brand-bg rounded w-1/2 mx-auto mb-8"></div>
              
              <div className="space-y-6">
                {[1, 2, 3, 4].map((qIndex) => (
                  <div key={qIndex} className="flex justify-between gap-4">
                    <div className="h-5 bg-brand-bg rounded w-full"></div>
                    <div className="h-5 bg-brand-bg rounded w-12 flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div id="top-banner" className="flex flex-col md:flex-row md:items-center justify-between bg-[#1A1A1A] text-white p-4 md:p-6 rounded-xl mb-8 gap-4 shadow-lg">
        <p className="text-sm md:text-base opacity-90 max-w-2xl">
          Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade {result.className} {result.subject} classes on the NCERT chapters:
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={onRegenerate}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            Regenerate
          </button>
          <button 
            onClick={onDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download as PDF
          </button>
        </div>
      </div>

      <div id="question-paper" className={`max-w-[800px] mx-auto bg-brand-surface border border-border rounded-xl shadow-sm p-6 md:p-12 print:shadow-none print:border-none print:p-0 ${hideBadges ? 'hide-badges' : ''}`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Delhi Public School, Bokaro Steel City</h1>
          <h2 className="text-lg md:text-xl font-semibold text-text-secondary">{result.subject} - {result.className}</h2>
          <h3 className="text-md font-medium text-text-secondary mt-1">{result.paperTitle}</h3>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center border-b-[3px] border-text-primary pb-4 mb-6 font-bold text-text-primary">
          <div>Time Allowed: {result.timeAllowed} minutes</div>
          <div>Maximum Marks: {result.totalMarks}</div>
        </div>

        <p className="italic text-center text-text-secondary font-medium mb-8">
          "All questions are compulsory unless stated otherwise."
        </p>

        <StudentInfoSection className={result.className} />

        {/* Sections */}
        {result.sections.map((section: any) => (
          <div key={section.id} className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-text-primary mb-1">{section.title}</h3>
              <p className="text-text-secondary font-semibold text-sm">{section.questionType}</p>
              <p className="italic text-text-secondary text-sm mt-1">{section.instruction}</p>
            </div>

            <div className="space-y-6">
              {section.questions.map((q: any) => (
                <div key={q.id} className="flex items-start gap-4 text-text-primary">
                  <div className="font-bold whitespace-nowrap">Q{q.id}.</div>
                  <div className="flex-1">
                    <span className="font-medium">{q.text}</span>
                    <span className="badge-wrapper">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </span>
                  </div>
                  <div className="font-bold text-text-secondary whitespace-nowrap">
                    [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center font-bold text-text-primary mt-16 pt-8 border-t border-dashed border-border uppercase tracking-widest text-sm">
          End of Question Paper
        </div>

        {/* Answer Key */}
        <div className="mt-20 pt-10 border-t-2 border-border print:break-before-page" id="answer-key">
          <h2 className="text-2xl font-bold text-center mb-8">Answer Key</h2>
          {result.sections.map((section: any) => (
            <div key={`ans-${section.id}`} className="mb-8">
              <h3 className="text-lg font-bold text-text-primary mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.questions.map((q: any) => (
                  <div key={`ans-${section.id}-${q.id}`} className="flex items-start gap-3">
                    <span className="font-bold text-text-primary whitespace-nowrap">Q{q.id}.</span>
                    <span className="text-text-secondary font-medium">{q.answer || 'No answer provided.'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
