import { create } from 'zustand';

interface GenerationState {
  jobId: string | null;
  status: 'idle' | 'queued' | 'processing' | 'done' | 'error';
  progress: number;
  message: string;
  result: any | null;
  error: string | null;

  setJob: (jobId: string) => void;
  updateStatus: (status: GenerationState['status'], progress: number, message: string) => void;
  setResult: (result: any) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  jobId: null,
  status: 'idle',
  progress: 0,
  message: '',
  result: null,
  error: null,

  setJob: (jobId) => set({ jobId, status: 'queued', progress: 0, message: 'Queued...', result: null, error: null }),
  updateStatus: (status, progress, message) => set({ status, progress, message }),
  setResult: (result) => set({ status: 'done', progress: 100, message: 'Done', result }),
  setError: (error) => set({ status: 'error', error, message: 'Failed' }),
  reset: () => set({ jobId: null, status: 'idle', progress: 0, message: '', result: null, error: null }),
}));
