"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestionPaper_1 = require("../models/QuestionPaper");
const assignmentQueue_1 = require("../queues/assignmentQueue");
const router = (0, express_1.Router)();
router.get('/:assignmentId', async (req, res, next) => {
    try {
        // Find latest QuestionPaper for assignmentId
        const paper = await QuestionPaper_1.QuestionPaper.findOne({ assignmentId: req.params.assignmentId }).sort({ version: -1 });
        if (!paper) {
            return res.status(404).json({ success: false, message: 'Paper not found' });
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
        const paper = await QuestionPaper_1.QuestionPaper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ success: false, message: 'Paper not found' });
        }
        paper.version += 1;
        paper.status = 'generating';
        await paper.save();
        const job = await (0, assignmentQueue_1.addGenerationJob)(paper.assignmentId.toString());
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
        if (!paper.pdfPath) {
            return res.status(404).json({ success: false, message: 'PDF not yet generated' });
        }
        const filename = `question-paper-${paper.metadata?.subject || 'subject'}-grade${paper.metadata?.grade || 'grade'}.pdf`;
        res.download(paper.pdfPath, filename);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
