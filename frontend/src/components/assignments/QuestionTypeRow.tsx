"use client";

import { X, Minus, Plus, ChevronDown } from 'lucide-react';
import { QuestionType, useAssignmentStore } from '@/store/assignmentStore';

interface QuestionTypeRowProps {
  qt: QuestionType;
}

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks'
];

export default function QuestionTypeRow({ qt }: QuestionTypeRowProps) {
  const { updateQuestionType, removeQuestionType, questionTypes } = useAssignmentStore();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuestionType(qt.id, { type: e.target.value });
  };

  const handleCountChange = (delta: number) => {
    const newCount = Math.max(1, qt.count + delta);
    updateQuestionType(qt.id, { count: newCount });
  };

  const handleMarksChange = (delta: number) => {
    const newMarks = Math.max(1, qt.marks + delta);
    updateQuestionType(qt.id, { marks: newMarks });
  };

  return (
    <div className="bg-white border border-border md:border-transparent md:bg-transparent rounded-[24px] p-4 md:p-0 shadow-sm md:shadow-none mb-2 md:mb-0 md:flex md:flex-row md:items-center md:gap-4 md:py-1 group">
      {/* Top row: Dropdown and Remove Button */}
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-0 md:flex-1">
        <div className="relative flex-1 bg-white md:border md:border-border rounded-full px-1 md:px-5 py-1 md:py-3 md:shadow-sm">
          <select 
            value={qt.type}
            onChange={handleTypeChange}
            className="w-full appearance-none bg-transparent outline-none text-[14px] text-text-primary font-bold md:font-medium pr-8 cursor-pointer"
          >
            {QUESTION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-text-secondary absolute right-2 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button 
          type="button"
          onClick={() => removeQuestionType(qt.id)}
          disabled={questionTypes.length === 1}
          className="flex md:hidden items-center justify-center p-2 text-text-secondary hover:text-brand-danger hover:bg-red-50 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom row: Steppers inside a gray box on mobile, or just inline on desktop */}
      <div className="md:hidden bg-[#F9F9F9] rounded-[20px] p-3 flex gap-3">
        <div className="flex-1 flex flex-col items-center gap-2">
          <span className="text-[11px] font-bold text-text-primary">No. of Questions</span>
          <div className="flex items-center justify-between bg-white rounded-full p-1.5 shadow-sm w-full">
            <button 
              type="button"
              onClick={() => handleCountChange(-1)}
              className="w-7 h-7 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-[14px] text-text-primary">{qt.count}</span>
            <button 
              type="button"
              onClick={() => handleCountChange(1)}
              className="w-7 h-7 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-2">
          <span className="text-[11px] font-bold text-text-primary">Marks</span>
          <div className="flex items-center justify-between bg-white rounded-full p-1.5 shadow-sm w-full">
            <button 
              type="button"
              onClick={() => handleMarksChange(-1)}
              className="w-7 h-7 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-[14px] text-text-primary">{qt.marks}</span>
            <button 
              type="button"
              onClick={() => handleMarksChange(1)}
              className="w-7 h-7 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Steppers */}
      <div className="hidden md:flex items-center gap-4 w-auto">
        <div className="flex items-center justify-between bg-white border border-border rounded-full p-1 shadow-sm w-24">
          <button 
            type="button"
            onClick={() => handleCountChange(-1)}
            className="w-8 h-8 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-[14px] text-text-primary">{qt.count}</span>
          <button 
            type="button"
            onClick={() => handleCountChange(1)}
            className="w-8 h-8 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between bg-white border border-border rounded-full p-1 shadow-sm w-20">
          <button 
            type="button"
            onClick={() => handleMarksChange(-1)}
            className="w-8 h-8 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-extrabold text-[14px] text-text-primary">{qt.marks}</span>
          <button 
            type="button"
            onClick={() => handleMarksChange(1)}
            className="w-8 h-8 flex items-center justify-center text-[#B3B3B3] hover:text-text-primary rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button 
          type="button"
          onClick={() => removeQuestionType(qt.id)}
          disabled={questionTypes.length === 1}
          className="flex items-center justify-center p-2 text-text-secondary hover:text-brand-danger hover:bg-red-50 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
