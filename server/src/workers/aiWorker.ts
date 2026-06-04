import { Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { emitToAssignment } from '../websocket/socketServer';
import { aiService } from '../services/aiService';
import { addPDFJob, GenerationJobData } from '../queues/assignmentQueue';

export const aiWorker = new Worker<GenerationJobData>(
  'question-generation',
  async (job: Job<GenerationJobData>) => {
    const { assignmentId } = job.data;
    
    // 1. Fetch Assignment from MongoDB
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }

    try {
      // 2. Update assignment.status = 'processing'
      assignment.status = 'processing';
      await assignment.save();

      // 3. emit to room
      const emitProgress = (step: string, percentage: number) => {
        emitToAssignment(assignmentId, 'job:progress', {
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
      const aiResult = await aiService.generatePaper(assignment);

      // Calculate duration logically: 1 mark = 2 mins
      const totalMins = (assignment.totalMarks || 100) * 2;
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      const timeParts = [];
      if (hours > 0) timeParts.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
      if (mins > 0) timeParts.push(`${mins} Mins`);
      const calculatedDuration = timeParts.join(' ') || '1 Hour';

      // 6. Validate structure, save QuestionPaper
      let paper = await QuestionPaper.findOne({ assignmentId: assignment._id, status: 'generating' }).sort({ version: -1 });
      if (paper) {
        paper.sections = aiResult.sections || [];
        paper.metadata = {
          school: 'Delhi Public School',
          totalMarks: assignment.totalMarks,
          generatedAt: new Date(),
          title: assignment.title,
          subject: assignment.subject,
          grade: assignment.grade,
          dueDate: assignment.dueDate,
          duration: calculatedDuration
        };
        paper.generationPrompt = aiResult.generationPrompt;
        paper.rawAIResponse = aiResult.rawAIResponse;
        paper.status = 'ready';
      } else {
        paper = new QuestionPaper({
          assignmentId: assignment._id,
          sections: aiResult.sections || [],
          metadata: {
            school: 'Delhi Public School',
            totalMarks: assignment.totalMarks,
            generatedAt: new Date(),
            title: assignment.title,
            subject: assignment.subject,
            grade: assignment.grade,
            dueDate: assignment.dueDate,
            duration: calculatedDuration
          },
          generationPrompt: aiResult.generationPrompt,
          rawAIResponse: aiResult.rawAIResponse,
          status: 'ready'
        });
      }
      await paper.save();



      // 7. Update assignment.status = 'completed'
      assignment.status = 'completed';
      await assignment.save();

      // 8. Enqueue PDF job
      await addPDFJob(paper._id.toString(), assignmentId);

      emitProgress('Completed', 100);

      // 9. Emit paper:ready
      emitToAssignment(assignmentId, 'paper:ready', {
        assignmentId,
        questionPaperId: paper._id,
        totalQuestions: assignment.totalQuestions,
        totalMarks: assignment.totalMarks
      });
      
    } catch (err: any) {
      // 10. On any error
      assignment.status = 'failed';
      await assignment.save();

      emitToAssignment(assignmentId, 'job:failed', {
        assignmentId,
        error: err.message,
        retryable: job.attemptsMade < 3
      });
      throw err; // throw to let BullMQ handle the retry/failure logic
    }
  },
  {
    connection: redisClient as any,
    concurrency: 2,
    autorun: false, // Start manually in server.ts
  }
);
