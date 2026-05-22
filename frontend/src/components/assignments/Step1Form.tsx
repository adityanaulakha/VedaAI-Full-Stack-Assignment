"use client";

import { useAssignmentStore } from '@/store/assignmentStore';

export default function Step1Form() {
  const { title, subject, className, topic, setTitle, setSubject, setClassName, setTopic } = useAssignmentStore();

  const SUBJECTS = ['Science', 'Math', 'English', 'Social Studies', 'Hindi'];
  const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Assignment Title *</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Mid-term Science Assessment" 
          className="w-full px-4 py-3 rounded-xl border border-border bg-brand-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Subject *</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-brand-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
            required
          >
            <option value="" disabled>Select Subject</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Class *</label>
          <select 
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-brand-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
            required
          >
            <option value="" disabled>Select Class</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Topic / Chapter (Optional)</label>
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Thermodynamics, Algebra" 
          className="w-full px-4 py-3 rounded-xl border border-border bg-brand-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
        />
      </div>
    </div>
  );
}
