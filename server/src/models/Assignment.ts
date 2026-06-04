import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionType {
  type: 'MCQ' | 'ShortAnswer' | 'LongAnswer' | 'TrueFalse' | 'FillBlank';
  count: number;
  marksEach: number;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  grade: string;
  board: 'CBSE' | 'ICSE' | 'State' | 'IB' | 'Other';
  dueDate?: Date;
  questionTypes: IQuestionType[];
  additionalInstructions?: string;
  uploadedFileContent?: string;
  uploadedFileName?: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  createdAt: Date;
  updatedAt: Date;
  totalMarks: number;
  totalQuestions: number;
}

const QuestionTypeSchema = new Schema<IQuestionType>({
  type: {
    type: String,
    enum: ['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank'],
    required: true,
  },
  count: { type: Number, required: true, min: 1, max: 50 },
  marksEach: { type: Number, required: true, min: 1, max: 20 },
});

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    grade: { type: String, required: true },
    board: {
      type: String,
      enum: ['CBSE', 'ICSE', 'State', 'IB', 'Other'],
      default: 'CBSE',
    },
    dueDate: { type: Date },
    questionTypes: [QuestionTypeSchema],
    additionalInstructions: { type: String },
    uploadedFileContent: { type: String },
    uploadedFileName: { type: String },
    status: {
      type: String,
      enum: ['draft', 'queued', 'processing', 'completed', 'failed'],
      default: 'draft',
    },
    jobId: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
AssignmentSchema.virtual('totalMarks').get(function (this: IAssignment) {
  if (!this.questionTypes) return 0;
  return this.questionTypes.reduce((sum, qt) => sum + qt.count * qt.marksEach, 0);
});

AssignmentSchema.virtual('totalQuestions').get(function (this: IAssignment) {
  if (!this.questionTypes) return 0;
  return this.questionTypes.reduce((sum, qt) => sum + qt.count, 0);
});

// Pre-save hook
AssignmentSchema.pre('save', function (next) {
  // If jobId is modified (i.e. set for the first time) and status is draft
  if (this.isModified('jobId') && this.jobId && this.status === 'draft') {
    this.status = 'queued';
  }
  next();
});

// Indexes
AssignmentSchema.index({ status: 1, createdAt: -1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
