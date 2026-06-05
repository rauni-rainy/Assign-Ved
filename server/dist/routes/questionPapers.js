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
const express_1 = require("express");
const QuestionPaper_1 = require("../models/QuestionPaper");
const assignmentQueue_1 = require("../queues/assignmentQueue");
const router = (0, express_1.Router)();
router.get('/:assignmentId', async (req, res, next) => {
    try {
        // Find latest QuestionPaper for assignmentId
        const paper = await QuestionPaper_1.QuestionPaper.findOne({ assignmentId: req.params.assignmentId })
            .select('+sections.questions.expectedAnswer')
            .sort({ version: -1 });
        if (!paper) {
            const { Assignment } = await Promise.resolve().then(() => __importStar(require('../models/Assignment')));
            const assignment = await Assignment.findById(req.params.assignmentId);
            if (!assignment) {
                return res.status(404).json({ success: false, message: 'Assignment not found' });
            }
            return res.status(202).json({ success: true, status: 'generating', message: 'Paper is being generated' });
        }
        if (paper.status === 'generating') {
            return res.status(202).json({ success: true, status: 'generating', message: 'Paper is being generated' });
        }
        res.json({ success: true, data: paper });
    }
    catch (error) {
        next(error);
    }
});
router.get('/assignment/:assignmentId/versions', async (req, res, next) => {
    try {
        const versions = await QuestionPaper_1.QuestionPaper.find({ assignmentId: req.params.assignmentId })
            .select('_id version createdAt status')
            .sort({ version: -1 });
        res.json({ success: true, data: versions });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id/with-answers', async (req, res, next) => {
    try {
        const token = req.headers['x-teacher-token'];
        if (token !== 'demo-token') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const paper = await QuestionPaper_1.QuestionPaper.findById(req.params.id).select('+sections.questions.expectedAnswer');
        if (!paper) {
            return res.status(404).json({ success: false, message: 'Paper not found' });
        }
        res.json({ success: true, data: paper });
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/regenerate', async (req, res, next) => {
    try {
        let assignmentId;
        let version = 1;
        const oldPaper = await QuestionPaper_1.QuestionPaper.findById(req.params.id);
        if (oldPaper) {
            assignmentId = oldPaper.assignmentId;
            version = oldPaper.version + 1;
        }
        else {
            const { Assignment } = await Promise.resolve().then(() => __importStar(require('../models/Assignment')));
            const assignment = await Assignment.findById(req.params.id);
            if (!assignment) {
                return res.status(404).json({ success: false, message: 'Paper or Assignment not found' });
            }
            assignmentId = assignment._id;
        }
        const newPaper = new QuestionPaper_1.QuestionPaper({
            assignmentId: assignmentId,
            version: version,
            status: 'generating'
        });
        await newPaper.save();
        const job = await (0, assignmentQueue_1.addGenerationJob)(assignmentId.toString());
        res.status(202).json({ success: true, jobId: job.id });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id/download', async (req, res, next) => {
    try {
        const paper = await QuestionPaper_1.QuestionPaper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ success: false, message: 'Paper not found' });
        }
        const includeAnswers = req.query.includeAnswers === 'true';
        const filePath = includeAnswers && paper.teacherPdfPath ? paper.teacherPdfPath : paper.pdfPath;
        if (!filePath) {
            return res.status(404).json({ success: false, message: 'PDF not yet generated' });
        }
        const filename = includeAnswers
            ? `question-paper-${paper.metadata?.subject || 'subject'}-grade${paper.metadata?.grade || 'grade'}-teacher.pdf`
            : `question-paper-${paper.metadata?.subject || 'subject'}-grade${paper.metadata?.grade || 'grade'}.pdf`;
        res.download(filePath, filename);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
