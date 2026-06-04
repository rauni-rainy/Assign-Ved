import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuestion {
  questionNumber: number;
  text: string;
  type: 'MCQ' | 'ShortAnswer' | 'LongAnswer' | 'TrueFalse' | 'FillBlank';
  difficulty: 'easy' | 'medium' | 'hard';
  bloomsLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  marks: number;
  options?: string[]; // MCQ only
  expectedAnswer?: string; // hidden
}

export interface ISection {
  title: string;
  instructions?: string;
  questions: IQuestion[];
}

export interface IQuestionPaperMetadata {
  school: string;
  title?: string;
  subject?: string;
  grade?: string;
  totalMarks?: number;
  duration?: string;
  generatedAt: Date;
  dueDate?: Date;
}

export interface IQuestionPaper extends Document {
  assignmentId: Types.ObjectId;
  version: number;
  sections: ISection[];
  metadata: IQuestionPaperMetadata;
  generationPrompt?: string; // stored for debugging
  rawAIResponse?: string; // stored for debugging; never expose
  pdfPath?: string;
  teacherPdfPath?: string;
  status: 'generating' | 'ready' | 'pdf_ready';
}

const QuestionSchema = new Schema<IQuestion>({
  questionNumber: { type: Number, required: true },
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  bloomsLevel: {
    type: String,
    enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
    required: true,
  },
  marks: { type: Number, required: true },
  options: [{ type: String }],
  expectedAnswer: { type: String, select: false }, // hidden by default in Mongoose queries
});

const SectionSchema = new Schema<ISection>({
  title: { type: String },
  instructions: { type: String },
  questions: [QuestionSchema],
});

const QuestionPaperSchema = new Schema<IQuestionPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    version: { type: Number, default: 1 },
    sections: [SectionSchema],
    metadata: {
      school: { type: String, default: 'Delhi Public School' },
      title: { type: String },
      subject: { type: String },
      grade: { type: String },
      totalMarks: { type: Number },
      duration: { type: String },
      generatedAt: { type: Date, default: Date.now },
      dueDate: { type: Date },
    },
    generationPrompt: { type: String, select: false },
    rawAIResponse: { type: String, select: false },
    pdfPath: { type: String },
    teacherPdfPath: { type: String },
    status: {
      type: String,
      enum: ['generating', 'ready', 'pdf_ready'],
      default: 'generating',
    },
  },
  { timestamps: true }
);

// Indexes
QuestionPaperSchema.index({ assignmentId: 1, version: -1 }, { unique: true });

export const QuestionPaper = mongoose.model<IQuestionPaper>('QuestionPaper', QuestionPaperSchema);
