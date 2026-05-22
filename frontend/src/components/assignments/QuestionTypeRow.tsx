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
    <div className="flex flex-col md:flex-row md:items-center gap-3 py-1 group">
      {/* Dropdown */}
      <div className="relative flex-1 bg-white border border-border rounded-full px-5 py-3 shadow-sm">
        <select 
          value={qt.type}
          onChange={handleTypeChange}
          className="w-full appearance-none bg-transparent outline-none text-[14px] text-text-primary font-medium pr-8 cursor-pointer"
        >
          {QUESTION_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Remove Button */}
      <button 
        type="button"
        onClick={() => removeQuestionType(qt.id)}
        disabled={questionTypes.length === 1}
        className="mx-1 flex items-center justify-center p-2 text-text-secondary hover:text-brand-danger hover:bg-red-50 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Count Stepper */}
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

        {/* Marks Stepper */}
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
      </div>
    </div>
  );
}
