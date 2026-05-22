import { create } from 'zustand';

export interface QuestionType {
  id: string;
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  title: string;
  subject: string;
  className: string;
  topic: string;
  examType: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInfo: string;
  file: File | null;
  currentStep: number;
  
  setField: <K extends keyof AssignmentState>(field: K, value: AssignmentState[K]) => void;
  addQuestionType: (qt: Omit<QuestionType, 'id'>) => void;
  updateQuestionType: (id: string, updates: Partial<Omit<QuestionType, 'id'>>) => void;
  removeQuestionType: (id: string) => void;
  reset: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  title: '',
  subject: '',
  className: '',
  topic: '',
  examType: '',
  dueDate: '',
  questionTypes: [{ id: '1', type: 'Multiple Choice Questions', count: 1, marks: 1 }],
  additionalInfo: '',
  file: null,
  currentStep: 1,

  setField: (field, value) => set({ [field]: value } as any),

  addQuestionType: (qt) => set((state) => ({
    questionTypes: [...state.questionTypes, { ...qt, id: Math.random().toString(36).substring(7) }]
  })),
  
  updateQuestionType: (id, updates) => set((state) => ({
    questionTypes: state.questionTypes.map(qt => qt.id === id ? { ...qt, ...updates } : qt)
  })),
  
  removeQuestionType: (id) => set((state) => ({
    questionTypes: state.questionTypes.filter(qt => qt.id !== id)
  })),

  reset: () => set({
    title: '',
    subject: '',
    className: '',
    topic: '',
    examType: '',
    dueDate: '',
    questionTypes: [{ id: '1', type: 'Multiple Choice Questions', count: 1, marks: 1 }],
    additionalInfo: '',
    file: null,
    currentStep: 1,
  })
}));
