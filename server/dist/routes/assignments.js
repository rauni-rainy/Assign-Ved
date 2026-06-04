"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const zod_1 = require("zod");
const Assignment_1 = require("../models/Assignment");
const QuestionPaper_1 = require("../models/QuestionPaper");
const assignmentQueue_1 = require("../queues/assignmentQueue");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF and TXT files are allowed'));
        }
    }
});
const assignmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    subject: zod_1.z.string().min(1),
    grade: zod_1.z.string().min(1),
    board: zod_1.z.enum(['CBSE', 'ICSE', 'State', 'IB', 'Other']).default('CBSE'),
    questionTypes: zod_1.z.string().transform(val => {
        try {
            return JSON.parse(val);
        }
        catch {
            return [];
        }
    }).pipe(zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank']),
        count: zod_1.z.number().min(1).max(50),
        marksEach: zod_1.z.number().min(1).max(20)
    })).min(1)),
    additionalInstructions: zod_1.z.string().optional()
});
router.post('/', upload.single('file'), async (req, res, next) => {
    try {
        const validated = assignmentSchema.parse(req.body);
        let uploadedFileContent = '';
        let uploadedFileName = '';
        if (req.file) {
            uploadedFileName = req.file.originalname;
            if (req.file.mimetype === 'application/pdf') {
                const pdfData = await (0, pdf_parse_1.default)(req.file.buffer);
                uploadedFileContent = pdfData.text;
            }
            else {
                uploadedFileContent = req.file.buffer.toString('utf-8');
            }
        }
        const assignment = new Assignment_1.Assignment({
            ...validated,
            uploadedFileContent,
            uploadedFileName
        });
        await assignment.save();
        const job = await (0, assignmentQueue_1.addGenerationJob)(assignment._id.toString());
        assignment.jobId = job.id;
        await assignment.save();
        res.status(201).json({ success: true, assignmentId: assignment._id, jobId: job.id });
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const assignments = await Assignment_1.Assignment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: assignments });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const assignment = await Assignment_1.Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        res.json({ success: true, data: assignment });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const assignment = await Assignment_1.Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        await QuestionPaper_1.QuestionPaper.deleteMany({ assignmentId: req.params.id });
        res.json({ success: true, message: 'Assignment deleted' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
