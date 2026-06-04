import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis';
import { QuestionPaper } from '../models/QuestionPaper';
import { emitToAssignment } from '../websocket/socketServer';
import { pdfService } from '../services/pdfService';
import { PDFJobData } from '../queues/assignmentQueue';

export const pdfWorker = new Worker<PDFJobData>(
  'pdf-generation',
  async (job: Job<PDFJobData>) => {
    const { questionPaperId, assignmentId } = job.data;
    
    // 1. Fetch QuestionPaper from MongoDB (populated)
    const paper = await QuestionPaper.findById(questionPaperId)
      .select('+sections.questions.expectedAnswer')
      .populate('assignmentId');
    if (!paper) {
      throw new Error(`QuestionPaper with ID ${questionPaperId} not found`);
    }

    try {
      // 2. Call pdfService.generate for both versions
      const pdfPath = await pdfService.generate(paper, false);
      const teacherPdfPath = await pdfService.generate(paper, true);
      
      // 3. Update paper.pdfPath and paper.status='pdf_ready'
      paper.pdfPath = pdfPath;
      paper.teacherPdfPath = teacherPdfPath;
      paper.status = 'pdf_ready';
      await paper.save();

      // 4. Emit pdf:ready
      emitToAssignment(assignmentId, 'pdf:ready', {
        assignmentId,
        pdfUrl: `/api/papers/download/${paper._id}`,
        fileName: `${paper._id}.pdf`
      });
    } catch (err) {
      throw err; // Let BullMQ handle failure/retries
    }
  },
  {
    connection: redisClient as any,
    concurrency: 5,
    autorun: false, // Start manually in server.ts
  }
);
