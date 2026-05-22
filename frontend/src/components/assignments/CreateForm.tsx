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
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb / Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
          <span>Assignment</span>
          <span>&gt;</span>
          <span className="text-brand-primary font-medium">Create Assignment</span>
          <span className="w-1.5 h-1.5 bg-brand-success rounded-full block ml-1"></span>
        </div>
        <p className="text-text-secondary text-sm">Fill in the details to generate an assessment.</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-border rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-text-primary transition-all duration-300 ease-in-out" 
          style={{ width: store.currentStep === 1 ? '50%' : '100%' }}
        />
      </div>

      <div className="bg-brand-surface rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <form onSubmit={store.currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-brand-danger rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {store.currentStep === 1 ? <Step1Form /> : <Step2Form />}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            {store.currentStep === 2 ? (
              <button 
                type="button" 
                onClick={handlePrevious}
                className="px-6 py-3 rounded-full border border-border text-text-primary font-medium hover:bg-brand-bg transition-colors"
                disabled={isSubmitting}
              >
                ← Previous
              </button>
            ) : (
              <div></div> // Empty div to push next button to the right
            )}

            {store.currentStep === 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-6 py-3 rounded-full bg-text-primary text-white font-medium hover:bg-black transition-colors"
              >
                Next →
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full bg-text-primary text-white font-medium hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-70"
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
