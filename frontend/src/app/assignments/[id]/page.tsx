"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAssignmentById } from '@/lib/api';
import { wsClient } from '@/lib/websocket';
import { useGenerationStore } from '@/store/generationStore';
import QuestionPaper from '@/components/output/QuestionPaper';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export default function AssignmentOutputPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const { status, progress, message, result, error, setJob, setResult, setError } = useGenerationStore();

  useEffect(() => {
    fetchAssignment();
    
    return () => {
      wsClient.disconnect();
    };
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const data = await getAssignmentById(id);
      
      if (data.assignment.status === 'completed' && data.result) {
        setResult(data.result);
      } else if (data.assignment.status === 'failed') {
        setError('Assignment generation failed previously.');
      } else if (data.assignment.jobId) {
        // It's still processing, connect to WS
        setJob(data.assignment.jobId);
        wsClient.connect(data.assignment.jobId);
      }
    } catch (err) {
      console.error('Error fetching assignment:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('question-paper');
      
      if (!element) {
        console.error("Question paper element not found");
        return;
      }

      // Add a wrapper to ensure specific width for consistent PDF output
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${result?.paperTitle || 'assignment'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/assignments/${id}/regenerate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to start regeneration');
      
      const data = await res.json();
      
      // Reset store states for new job
      useGenerationStore.setState({
        status: 'queued',
        progress: 0,
        message: 'Regeneration requested...',
        result: null,
        error: null,
        jobId: data.jobId,
      });

      // reconnect WS
      wsClient.disconnect();
      wsClient.connect(data.jobId);

    } catch (error) {
      console.error(error);
      alert('Failed to trigger regeneration.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto h-full">
      {/* Breadcrumb */}
      <div className="mb-6 hidden md:block">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
          <span>Assignment</span>
          <span>&gt;</span>
          <span className="text-brand-primary font-medium">Output</span>
          <span className="w-1.5 h-1.5 bg-brand-success rounded-full block ml-1"></span>
        </div>
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center max-w-lg mx-auto mt-20">
          <XCircle className="w-12 h-12 text-brand-danger mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Generation Failed</h2>
          <p className="text-red-600 mb-6">{error || 'An unexpected error occurred during AI generation.'}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isRegenerating ? 'Retrying...' : 'Retry Generation'}
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-white text-text-primary border border-border rounded-lg hover:bg-brand-surface transition-colors font-medium"
            >
              Create New
            </button>
          </div>
        </div>
      )}

      {(status === 'queued' || status === 'processing') && (
        <div className="mb-8 p-6 bg-brand-surface rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
              {message || 'Processing...'}
            </h3>
            <span className="text-brand-primary font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {(status === 'queued' || status === 'processing' || status === 'done') && (
        <QuestionPaper 
          result={result} 
          isLoading={status !== 'done'} 
          onDownload={handleDownload}
          onRegenerate={handleRegenerate}
          hideBadges={isExporting}
        />
      )}
    </div>
  );
}
