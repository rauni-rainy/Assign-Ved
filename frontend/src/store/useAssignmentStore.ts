import { create } from 'zustand';

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  status: string;
  jobId?: string;
}

export interface QuestionPaper {
  _id: string;
  assignmentId: string;
  sections: any[];
  metadata: any;
  status: string;
}

export interface JobProgressState {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  percentage: number;
  step: string;
  error?: string;
  questionPaperId?: string;
}

interface AssignmentStore {
  assignments: Assignment[];
  currentPaper: QuestionPaper | null;
  jobProgress: Record<string, JobProgressState>;
  setAssignments: (assignments: Assignment[]) => void;
  setCurrentPaper: (paper: QuestionPaper | null) => void;
  setJobProgress: (assignmentId: string, progress: Partial<JobProgressState>) => void;
  setPaperReady: (assignmentId: string, paperId: string) => void;
  setFailed: (assignmentId: string, error: string) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  currentPaper: null,
  jobProgress: {},
  setAssignments: (assignments) => set({ assignments }),
  setCurrentPaper: (paper) => set({ currentPaper: paper }),
  setJobProgress: (assignmentId, progress) => set((state) => ({
    jobProgress: {
      ...state.jobProgress,
      [assignmentId]: {
        ...(state.jobProgress[assignmentId] || { status: 'pending', percentage: 0, step: 'Initializing' }),
        ...progress,
      }
    }
  })),
  setPaperReady: (assignmentId, paperId) => set((state) => ({
    jobProgress: {
      ...state.jobProgress,
      [assignmentId]: {
        ...(state.jobProgress[assignmentId] || { percentage: 0, step: 'Completed' }),
        status: 'completed',
        percentage: 100,
        step: 'Completed',
        questionPaperId: paperId,
      }
    }
  })),
  setFailed: (assignmentId, error) => set((state) => ({
    jobProgress: {
      ...state.jobProgress,
      [assignmentId]: {
        ...(state.jobProgress[assignmentId] || { percentage: 0, step: 'Failed' }),
        status: 'failed',
        error,
      }
    }
  })),
}));
