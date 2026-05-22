"use client";

import { Calendar, Plus, Mic } from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import QuestionTypeRow from './QuestionTypeRow';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function Step2Form() {
  const { dueDate, questionTypes, addQuestionType, additionalInfo, setField } = useAssignmentStore();

  const totalQuestions = questionTypes.reduce((acc, qt) => acc + qt.count, 0);
  const totalMarks = questionTypes.reduce((acc, qt) => acc + (qt.count * qt.marks), 0);

  return (
    <div>
      <FileUploadZone />

      <div className="mb-10">
        <label className="block text-[14px] font-extrabold text-text-primary mb-3">Due Date</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="DD-MM-YYYY"
            value={dueDate}
            onChange={(e) => setField('dueDate', e.target.value)}
            className="w-full px-5 py-3.5 rounded-full border border-border bg-[#F9F9F9] text-text-primary text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-shadow shadow-sm"
            required
          />
          <Calendar className="w-5 h-5 text-text-secondary absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-end mb-4">
          <div className="flex-1">
            <label className="block text-[14px] font-extrabold text-text-primary">Question Type</label>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[13px] text-text-primary font-bold">
            <span className="w-24 text-center">No. of Questions</span>
            <span className="w-20 text-center">Marks</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {questionTypes.map((qt) => (
            <QuestionTypeRow key={qt.id} qt={qt} />
          ))}
        </div>

        <button 
          type="button"
          onClick={() => addQuestionType({ type: 'Multiple Choice Questions', count: 1, marks: 1 })}
          className="flex items-center gap-3 text-[14px] font-bold text-text-primary hover:text-black transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center shadow-sm">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Add Question Type
        </button>

        <div className="flex justify-end flex-col items-end gap-1 mt-8">
          <div className="text-[13px] text-text-primary font-medium">Total Questions : <span className="font-extrabold text-[14px] ml-1">{totalQuestions}</span></div>
          <div className="text-[13px] text-text-primary font-medium">Total Marks : <span className="font-extrabold text-[14px] ml-1">{totalMarks}</span></div>
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-extrabold text-text-primary mb-3">
          Additional Information <span className="text-[#8C8C8C] font-medium ml-1">(For better output)</span>
        </label>
        <div className="relative">
          <textarea 
            value={additionalInfo}
            onChange={(e) => setField('additionalInfo', e.target.value)}
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
            className="w-full h-[120px] px-6 py-5 rounded-[24px] border-2 border-dashed border-border bg-[#F9F9F9] text-text-primary text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] resize-none transition-shadow"
          />
          <button type="button" className="absolute bottom-5 right-5 w-8 h-8 flex items-center justify-center bg-[#E5E5E5] rounded-full text-text-primary hover:bg-[#d4d4d4] transition-colors shadow-sm">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
