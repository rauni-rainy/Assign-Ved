import { Router } from 'express';
import mongoose from 'mongoose';
import { redisClient } from '../config/redis';
import { questionGenerationQueue, pdfGenerationQueue } from '../queues/assignmentQueue';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const questionQueueCounts = await questionGenerationQueue.getJobCounts();
    const pdfQueueCounts = await pdfGenerationQueue.getJobCounts();

    res.json({
      success: true,
      data: {
        database: {
          readyState: mongoose.connection.readyState,
          status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
        },
        redis: {
          status: redisClient.status
        },
        queues: {
          questionGeneration: questionQueueCounts,
          pdfGeneration: pdfQueueCounts
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
