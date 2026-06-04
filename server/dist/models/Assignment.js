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
exports.Assignment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const QuestionTypeSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank'],
        required: true,
    },
    count: { type: Number, required: true, min: 1, max: 50 },
    marksEach: { type: Number, required: true, min: 1, max: 20 },
});
const AssignmentSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtuals
AssignmentSchema.virtual('totalMarks').get(function () {
    if (!this.questionTypes)
        return 0;
    return this.questionTypes.reduce((sum, qt) => sum + qt.count * qt.marksEach, 0);
});
AssignmentSchema.virtual('totalQuestions').get(function () {
    if (!this.questionTypes)
        return 0;
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
exports.Assignment = mongoose_1.default.model('Assignment', AssignmentSchema);
