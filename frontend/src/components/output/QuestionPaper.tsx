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
        <div className="p-8 lg:p-12 animate-pulse">
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
    <div className="space-y-4 lg:space-y-0 lg:bg-[#1a1a1a] lg:rounded-[32px] lg:p-10 lg:shadow-2xl relative overflow-hidden">
      
      {/* Top Banner - separate card on mobile, transparent on desktop */}
      <div className="bg-[#1a1a1a] lg:bg-transparent rounded-[24px] lg:rounded-none p-6 lg:p-0">
        <div id="top-banner" className="flex flex-col lg:flex-row lg:items-start justify-between text-white mb-0 lg:mb-8 gap-6 relative z-10">
          <p className="text-[15px] lg:text-[17px] leading-relaxed opacity-90 max-w-2xl font-medium">
            Certainly, Aditya Naulakha! Here are customized Question Paper for your CBSE Grade {result.className} {result.subject} classes on the NCERT chapters:
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button 
              onClick={onRegenerate}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 lg:py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full transition-colors whitespace-nowrap text-sm font-bold shadow-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Regenerate
            </button>
            <button 
              onClick={onDownload}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 lg:py-2.5 bg-white text-[#1a1a1a] rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap text-sm font-bold shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download as PDF
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 lg:bg-[#e8e8e8] lg:p-8 rounded-[24px]">
        <div id="question-paper" className={`mx-auto bg-white border border-border lg:border-none shadow-md lg:shadow-lg rounded-[24px] lg:rounded-none p-6 lg:p-14 print:shadow-none print:border-none print:p-0 ${hideBadges ? 'hide-badges' : ''}`}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-text-primary mb-2 tracking-tight">Delhi Public School, Sector-45, Noida</h1>
            {result.examType && (
              <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-2 uppercase tracking-wide">{result.examType} Examination</h2>
            )}
            <h2 className="text-lg lg:text-xl font-bold text-text-secondary">
              {result.subject} {result.topic && <span className="font-semibold text-text-secondary"> — {result.topic}</span>}
            </h2>
          </div>

          {/* Meta Info */}
          <div className="flex justify-between items-center border-b-4 border-text-primary pb-4 mb-8 font-extrabold text-text-primary text-[15px]">
            <div>Time Allowed: {result.timeAllowed} minutes</div>
            <div>Maximum Marks: {result.totalMarks}</div>
          </div>

          <p className="italic text-center text-text-secondary font-medium mb-10">
            "All questions are compulsory unless stated otherwise."
          </p>

          <StudentInfoSection className={result.className} />

          {/* Sections */}
          {result.sections.map((section: any) => (
            <div key={section.id} className="mb-14">
              <div className="text-center mb-8">
                <h3 className="text-xl font-extrabold text-text-primary mb-1 underline underline-offset-4 decoration-2">{section.title}</h3>
                <p className="text-text-secondary font-bold text-sm">{section.questionType}</p>
                <p className="italic text-text-secondary text-[13px] mt-1">{section.instruction}</p>
              </div>

              <div className="space-y-6">
                {section.questions.map((q: any) => (
                  <div key={q.id} className="flex items-start gap-4 text-text-primary print:break-inside-avoid">
                    <div className="font-extrabold whitespace-nowrap text-[15px]">Q{q.id}.</div>
                    <div className="flex-1">
                      <span className="font-semibold leading-relaxed text-[15px]">{q.text}</span>
                      <span className="badge-wrapper">
                        <DifficultyBadge difficulty={q.difficulty} />
                      </span>
                    </div>
                    <div className="font-extrabold text-text-secondary whitespace-nowrap text-sm mt-0.5">
                      [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center font-extrabold text-[#8C8C8C] mt-20 pt-8 border-t-2 border-dashed border-border uppercase tracking-widest text-xs">
            End of Question Paper
          </div>

          {/* Answer Key */}
          <div className="mt-24 pt-12 border-t-4 border-text-primary print:break-before-page" id="answer-key">
            <h2 className="text-2xl font-extrabold text-center mb-10 uppercase tracking-tight">Answer Key</h2>
            {result.sections.map((section: any) => (
              <div key={`ans-${section.id}`} className="mb-10">
                <h3 className="text-lg font-extrabold text-text-primary mb-5 underline decoration-2 underline-offset-4">{section.title}</h3>
                <div className="space-y-5 bg-[#F9F9F9] p-6 rounded-xl border border-border">
                  {section.questions.map((q: any) => (
                    <div key={`ans-${section.id}-${q.id}`} className="flex items-start gap-4 print:break-inside-avoid">
                      <span className="font-extrabold text-text-primary whitespace-nowrap bg-white border border-border rounded px-2 py-0.5 text-sm shadow-sm">Q{q.id}</span>
                      <span className="text-text-primary font-medium leading-relaxed">{q.answer || 'No answer provided.'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
