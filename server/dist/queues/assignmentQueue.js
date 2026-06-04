"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobProgress = exports.addPDFJob = exports.addGenerationJob = exports.pdfGenerationQueue = exports.questionGenerationQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.questionGenerationQueue = new bullmq_1.Queue('question-generation', {
    connection: redis_1.redisClient,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 50,
        removeOnFail: 100,
    },
});
exports.pdfGenerationQueue = new bullmq_1.Queue('pdf-generation', {
    connection: redis_1.redisClient,
    defaultJobOptions: {
        attempts: 2,
        backoff: { type: 'fixed', delay: 3000 },
        removeOnComplete: 50,
        removeOnFail: 50,
    },
});
const addGenerationJob = async (assignmentId) => {
    return await exports.questionGenerationQueue.add('generate-questions', { assignmentId });
};
exports.addGenerationJob = addGenerationJob;
const addPDFJob = async (questionPaperId, assignmentId) => {
    return await exports.pdfGenerationQueue.add('generate-pdf', { questionPaperId, assignmentId });
};
exports.addPDFJob = addPDFJob;
const getJobProgress = async (jobId, queueName) => {
    const queue = queueName === 'question-generation' ? exports.questionGenerationQueue : exports.pdfGenerationQueue;
    const job = await queue.getJob(jobId);
    return job ? job.progress : null;
};
exports.getJobProgress = getJobProgress;
