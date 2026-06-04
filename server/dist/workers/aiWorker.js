"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const Assignment_1 = require("../models/Assignment");
const QuestionPaper_1 = require("../models/QuestionPaper");
const socketServer_1 = require("../websocket/socketServer");
const aiService_1 = require("../services/aiService");
const assignmentQueue_1 = require("../queues/assignmentQueue");
exports.aiWorker = new bullmq_1.Worker('question-generation', async (job) => {
    const { assignmentId } = job.data;
    // 1. Fetch Assignment from MongoDB
    const assignment = await Assignment_1.Assignment.findById(assignmentId);
    if (!assignment) {
        throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    try {
        // 2. Update assignment.status = 'processing'
        assignment.status = 'processing';
        await assignment.save();
        // 3. emit to room
        const emitProgress = (step, percentage) => {
            (0, socketServer_1.emitToAssignment)(assignmentId, 'job:progress', {
                assignmentId,
                step,
                percentage
            });
            job.updateProgress(percentage);
        };
        emitProgress('Analyzing requirements', 10);
        // Simulate intermediate progress points
        setTimeout(() => emitProgress('Planning structure', 20), 500);
        setTimeout(() => emitProgress('Generating content', 50), 1000);
        setTimeout(() => emitProgress('Reviewing difficulty', 70), 1500);
        setTimeout(() => emitProgress('Finalizing paper', 85), 2000);
        // 4. Call aiService.generatePaper(assignment)
        const aiResult = await aiService_1.aiService.generatePaper(assignment);
        // 6. Validate structure, save QuestionPaper
        const paper = new QuestionPaper_1.QuestionPaper({
            assignmentId: assignment._id,
            sections: aiResult.sections || [],
            metadata: {
                school: 'Delhi Public School',
                totalMarks: assignment.totalMarks,
                generatedAt: new Date()
            },
            generationPrompt: aiResult.generationPrompt,
            rawAIResponse: aiResult.rawAIResponse,
            status: 'ready'
        });
        await paper.save();
        // 7. Update assignment.status = 'completed'
        assignment.status = 'completed';
        await assignment.save();
        // 8. Enqueue PDF job
        await (0, assignmentQueue_1.addPDFJob)(paper._id.toString(), assignmentId);
        emitProgress('Completed', 100);
        // 9. Emit paper:ready
        (0, socketServer_1.emitToAssignment)(assignmentId, 'paper:ready', {
            assignmentId,
            questionPaperId: paper._id,
            totalQuestions: assignment.totalQuestions,
            totalMarks: assignment.totalMarks
        });
    }
    catch (err) {
        // 10. On any error
        assignment.status = 'failed';
        await assignment.save();
        (0, socketServer_1.emitToAssignment)(assignmentId, 'job:failed', {
            assignmentId,
            error: err.message,
            retryable: job.attemptsMade < 3
        });
        throw err; // throw to let BullMQ handle the retry/failure logic
    }
}, {
    connection: redis_1.redisClient,
    concurrency: 2,
    autorun: false, // Start manually in server.ts
});
