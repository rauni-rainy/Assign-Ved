"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const QuestionPaper_1 = require("../models/QuestionPaper");
const socketServer_1 = require("../websocket/socketServer");
const pdfService_1 = require("../services/pdfService");
exports.pdfWorker = new bullmq_1.Worker('pdf-generation', async (job) => {
    const { questionPaperId, assignmentId } = job.data;
    // 1. Fetch QuestionPaper from MongoDB (populated)
    const paper = await QuestionPaper_1.QuestionPaper.findById(questionPaperId)
        .select('+sections.questions.expectedAnswer')
        .populate('assignmentId');
    if (!paper) {
        throw new Error(`QuestionPaper with ID ${questionPaperId} not found`);
    }
    try {
        // 2. Call pdfService.generate for both versions
        const pdfPath = await pdfService_1.pdfService.generate(paper, false);
        const teacherPdfPath = await pdfService_1.pdfService.generate(paper, true);
        // 3. Update paper.pdfPath and paper.status='pdf_ready'
        paper.pdfPath = pdfPath;
        paper.teacherPdfPath = teacherPdfPath;
        paper.status = 'pdf_ready';
        await paper.save();
        // 4. Emit pdf:ready
        (0, socketServer_1.emitToAssignment)(assignmentId, 'pdf:ready', {
            assignmentId,
            pdfUrl: `/api/papers/download/${paper._id}`,
            fileName: `${paper._id}.pdf`
        });
    }
    catch (err) {
        throw err; // Let BullMQ handle failure/retries
    }
}, {
    connection: redis_1.redisClient,
    concurrency: 5,
    autorun: false, // Start manually in server.ts
});
