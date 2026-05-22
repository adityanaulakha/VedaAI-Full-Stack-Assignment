"use client";

import { Calendar, Plus, Mic } from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import QuestionTypeRow from './QuestionTypeRow';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function Step2Form() {
  const { dueDate, setDueDate, questionTypes, addQuestionType, additionalInfo, setAdditionalInfo } = useAssignmentStore();

  const totalQuestions = questionTypes.reduce((acc, qt) => acc + qt.count, 0);
  const totalMarks = questionTypes.reduce((acc, qt) => acc + (qt.count * qt.marks), 0);

  return (
    <div>
      <FileUploadZone />

      <div className="mb-8">
        <label className="block text-sm font-medium text-text-primary mb-2">Due Date *</label>
        <div className="relative">
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-brand-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
            required
            min={new Date().toISOString().split('T')[0]}
          />
          <Calendar className="w-5 h-5 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <label className="block text-sm font-medium text-text-primary">Question Type *</label>
          <div className="hidden md:flex gap-16 mr-10 text-xs text-text-secondary font-medium">
            <span>No. of Questions</span>
            <span>Marks</span>
          </div>
        </div>

        {questionTypes.map((qt) => (
          <QuestionTypeRow key={qt.id} qt={qt} />
        ))}

        <button 
          type="button"
          onClick={() => addQuestionType({ type: 'Multiple Choice Questions', count: 1, marks: 1 })}
          className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-brand-primary transition-colors mt-4"
        >
          <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          Add Question Type
        </button>

        <div className="flex justify-end gap-6 mt-4 pt-4 border-t border-border">
          <div className="text-sm">Total Questions: <span className="font-bold">{totalQuestions}</span></div>
          <div className="text-sm">Total Marks: <span className="font-bold">{totalMarks}</span></div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Additional Information <span className="text-text-secondary font-normal">(For better output)</span>
        </label>
        <div className="relative">
          <textarea 
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="e.g. Generate a question paper for 3 hour exam duration..."
            className="w-full h-[100px] px-4 py-3 rounded-xl border border-border bg-brand-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          />
          <button type="button" className="absolute bottom-4 right-4 p-2 bg-brand-bg rounded-full text-text-secondary hover:text-brand-primary transition-colors">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
