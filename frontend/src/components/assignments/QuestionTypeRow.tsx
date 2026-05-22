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
    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-brand-surface border border-border p-3 md:p-2 md:pl-4 rounded-xl shadow-sm mb-3 group">
      {/* Dropdown */}
      <div className="relative flex-1">
        <select 
          value={qt.type}
          onChange={handleTypeChange}
          className="w-full appearance-none bg-transparent outline-none text-text-primary font-medium py-2 pr-8 cursor-pointer"
        >
          {QUESTION_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="hidden md:block w-px h-8 bg-border"></div>

      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
        {/* Count Stepper */}
        <div className="flex flex-col items-start md:items-center">
          <span className="text-xs text-text-secondary mb-1 md:hidden">No. of Questions</span>
          <div className="flex items-center bg-brand-bg rounded-lg p-1 border border-border">
            <button 
              type="button"
              onClick={() => handleCountChange(-1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white rounded-md transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{qt.count}</span>
            <button 
              type="button"
              onClick={() => handleCountChange(1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Marks Stepper */}
        <div className="flex flex-col items-start md:items-center">
          <span className="text-xs text-text-secondary mb-1 md:hidden">Marks per Question</span>
          <div className="flex items-center bg-brand-bg rounded-lg p-1 border border-border">
            <button 
              type="button"
              onClick={() => handleMarksChange(-1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white rounded-md transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{qt.marks}</span>
            <button 
              type="button"
              onClick={() => handleMarksChange(1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px h-8 bg-border ml-2"></div>

      {/* Remove Button */}
      <button 
        type="button"
        onClick={() => removeQuestionType(qt.id)}
        disabled={questionTypes.length === 1}
        className="w-full md:w-auto mt-2 md:mt-0 flex items-center justify-center p-2 text-text-secondary hover:text-brand-danger hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
