export interface Assignment {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionPaper {
  id: string;
  assignmentId: string;
  content: string; // The generated content
  createdAt: Date;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobProgressEvent {
  assignmentId: string;
  step: string;
  percentage: number;
}

export interface PaperReadyEvent {
  assignmentId: string;
  questionPaperId: string;
  totalQuestions: number;
  totalMarks: number;
}

export interface PdfReadyEvent {
  assignmentId: string;
  pdfUrl: string;
  fileName: string;
}

export interface JobFailedEvent {
  assignmentId: string;
  error: string;
  retryable: boolean;
}
