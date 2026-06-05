import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import healthRoutes from './routes/health';
import assignmentRoutes from './routes/assignments';
import questionPaperRoutes from './routes/questionPapers';

const app = express();

// Parse FRONTEND_URL to support multiple comma-separated domains
const allowedOrigins = env.FRONTEND_URL.split(',').map((url) => url.trim());

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/question-papers', questionPaperRoutes);

// Global Error Handler
app.use(errorHandler);

export { app };
