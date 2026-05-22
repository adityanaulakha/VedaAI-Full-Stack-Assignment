"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useGenerationStore } from '@/store/generationStore';
import { createAssignment } from '@/lib/api';

export default function CreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const store = useAssignmentStore();
  const { setJob } = useGenerationStore();

  const handleNext = () => {
    // Basic validation for Step 1
    if (!store.title || !store.subject || !store.className) {
      setError('Please fill in all required fields (Title, Subject, Class).');
      return;
    }
    setError(null);
    store.setField('currentStep', 2);
  };

  const handlePrevious = () => {
    store.setField('currentStep', 1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for Step 2
    if (!store.dueDate) {
      setError('Please select a due date.');
      return;
    }

    if (store.questionTypes.length === 0) {
      setError('Please add at least one question type.');
      return;
    }

    // Check for duplicates
    const types = store.questionTypes.map(qt => qt.type);
    if (new Set(types).size !== types.length) {
      setError('Cannot have duplicate question types.');
      return;
    }

    // Cannot have 0 questions or 0 marks
    const invalidQt = store.questionTypes.find(qt => qt.count <= 0 || qt.marks <= 0);
    if (invalidQt) {
      setError('Question count and marks must be greater than 0.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Create formData if file exists
      const payload = {
        title: store.title,
        subject: store.subject,
        className: store.className,
        topic: store.topic,
        dueDate: store.dueDate,
        questionTypes: store.questionTypes.map(qt => ({ type: qt.type, count: qt.count, marks: qt.marks })),
        additionalInfo: store.additionalInfo,
        // Mock file handling - in a real app, we'd use FormData and multipart/form-data
        fileContent: store.file ? store.file.name : undefined 
      };

      const { assignmentId, jobId } = await createAssignment(payload);
      
      // Init generation store
      setJob(jobId);
      
      // Reset form
      store.reset();

      // Navigate to output page
      router.push(`/assignments/${assignmentId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create assignment');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-32">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[28px] font-extrabold text-text-primary">Create Assignment</h1>
        <p className="text-[#8C8C8C] text-[15px] mt-1">Set up a new assignment for your students.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        <div className={`h-2 flex-1 rounded-full transition-colors ${store.currentStep >= 1 ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'}`} />
        <div className={`h-2 flex-1 rounded-full transition-colors ${store.currentStep >= 2 ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'}`} />
      </div>

      <div className="bg-white rounded-[32px] shadow-sm p-8 md:p-10 relative">
        <div className="mb-8 border-b border-border pb-6">
          <h2 className="text-xl font-bold text-text-primary">
            {store.currentStep === 1 ? 'Assignment Setup' : 'Assignment Details'}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {store.currentStep === 1 ? 'Basic configuration for the assignment' : 'Basic information about your assignment'}
          </p>
        </div>

        <form onSubmit={store.currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-brand-danger rounded-[16px] text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          {store.currentStep === 1 ? <Step1Form /> : <Step2Form />}

          <div className="fixed bottom-8 left-[calc(50%+140px)] -translate-x-1/2 flex items-center gap-4 z-40 bg-[#F2F2F2]/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20">
            {store.currentStep === 2 ? (
              <button 
                type="button" 
                onClick={handlePrevious}
                className="px-6 py-3.5 rounded-full bg-white text-text-primary font-bold shadow-sm hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                ← Previous
              </button>
            ) : null}

            {store.currentStep === 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-8 py-3.5 rounded-full bg-[#1a1a1a] text-white font-bold shadow-md hover:bg-black transition-colors"
              >
                Next →
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-[#1a1a1a] text-white font-bold shadow-md hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Paper →'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
