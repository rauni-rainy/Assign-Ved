"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionPaper = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const QuestionSchema = new mongoose_1.Schema({
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
const SectionSchema = new mongoose_1.Schema({
    title: { type: String },
    instructions: { type: String },
    questions: [QuestionSchema],
});
const QuestionPaperSchema = new mongoose_1.Schema({
    assignmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// Indexes
QuestionPaperSchema.index({ assignmentId: 1, version: -1 }, { unique: true });
exports.QuestionPaper = mongoose_1.default.model('QuestionPaper', QuestionPaperSchema);
