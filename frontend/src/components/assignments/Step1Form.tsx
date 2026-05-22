"use client";

import { useAssignmentStore } from '@/store/assignmentStore';

export default function Step1Form() {
  const { title, subject, className, topic, setField } = useAssignmentStore();

  const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  const getSubjects = (cls: string) => {
    if (cls === 'Class 11' || cls === 'Class 12') {
      return ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'Hindi', 'Computer', 'Social Studies'];
    }
    return ['Science', 'Maths', 'English', 'Social Studies', 'Hindi', 'Computer'];
  };

  const currentSubjects = getSubjects(className);

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-extrabold text-text-primary mb-3">Class <span className="text-[#EF4444]">*</span></label>
          <div className="relative">
            <select 
              value={className}
              onChange={(e) => setField('className', e.target.value)}
              className="w-full px-5 py-4 rounded-[16px] border border-border bg-white text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] appearance-none shadow-sm cursor-pointer"
              required
            >
              <option value="" disabled>Select Class</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#8C8C8C]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-extrabold text-text-primary mb-3">Subject <span className="text-[#EF4444]">*</span></label>
          <div className="relative">
            <select 
              value={subject}
              onChange={(e) => setField('subject', e.target.value)}
              className="w-full px-5 py-4 rounded-[16px] border border-border bg-white text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] appearance-none shadow-sm cursor-pointer"
              required
            >
              <option value="" disabled>Select Subject</option>
              {currentSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#8C8C8C]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-extrabold text-text-primary mb-3">Topic / Chapter <span className="text-[#8C8C8C] font-medium ml-1">(Optional)</span></label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setField('topic', e.target.value)}
            placeholder="e.g. Thermodynamics, Algebra" 
            className="w-full px-5 py-4 rounded-[16px] border border-border bg-white text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] transition-shadow shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-extrabold text-text-primary mb-3">Examination Type <span className="text-[#EF4444]">*</span></label>
          <div className="relative">
            <select 
              value={useAssignmentStore(state => state.examType)}
              onChange={(e) => setField('examType', e.target.value)}
              className="w-full px-5 py-4 rounded-[16px] border border-border bg-white text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] appearance-none shadow-sm cursor-pointer"
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-yearly">Half-yearly</option>
              <option value="Final Exams">Final Exams</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#8C8C8C]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
