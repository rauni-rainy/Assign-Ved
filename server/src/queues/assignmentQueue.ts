import { Queue } from 'bullmq';
import { redisClient } from '../config/redis';

export interface GenerationJobData {
  assignmentId: string;
}

export interface PDFJobData {
  questionPaperId: string;
  assignmentId: string;
}

export const questionGenerationQueue = new Queue('question-generation', {
  connection: redisClient as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 50,
    removeOnFail: 100,
  },
});

export const pdfGenerationQueue = new Queue('pdf-generation', {
  connection: redisClient as any,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 3000 },
    removeOnComplete: 50,
    removeOnFail: 50,
  },
});

export const addGenerationJob = async (assignmentId: string) => {
  return await questionGenerationQueue.add('generate-questions', { assignmentId });
};

export const addPDFJob = async (questionPaperId: string, assignmentId: string) => {
  return await pdfGenerationQueue.add('generate-pdf', { questionPaperId, assignmentId });
};

export const getJobProgress = async (jobId: string, queueName: 'question-generation' | 'pdf-generation') => {
  const queue = queueName === 'question-generation' ? questionGenerationQueue : pdfGenerationQueue;
  const job = await queue.getJob(jobId);
  return job ? job.progress : null;
};
