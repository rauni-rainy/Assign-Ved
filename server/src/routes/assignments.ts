import { Router } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { z } from 'zod';
import { Assignment } from '../models/Assignment';
import { QuestionPaper } from '../models/QuestionPaper';
import { addGenerationJob } from '../queues/assignmentQueue';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  }
});

const assignmentSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(1),
  grade: z.string().min(1),
  board: z.enum(['CBSE', 'ICSE', 'State', 'IB', 'Other']).default('CBSE'),
  questionTypes: z.string().transform(val => {
    try { return JSON.parse(val); } catch { return []; }
  }).pipe(z.array(z.object({
    type: z.enum(['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank']),
    count: z.number().min(1).max(50),
    marksEach: z.number().min(1).max(20)
  })).min(1)),
  additionalInstructions: z.string().optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const validated = assignmentSchema.parse(req.body);
    let uploadedFileContent = '';
    let uploadedFileName = '';

    if (req.file) {
      uploadedFileName = req.file.originalname;
      if (req.file.mimetype === 'application/pdf') {
        try {
          const pdfData = await pdfParse(req.file.buffer);
          uploadedFileContent = pdfData.text;
        } catch (err) {
          return res.status(400).json({ success: false, message: 'Invalid or corrupt PDF file uploaded. Please ensure the file is a valid PDF.' });
        }
      } else {
        uploadedFileContent = req.file.buffer.toString('utf-8');
      }
    }

    const assignment = new Assignment({
      ...validated,
      uploadedFileContent,
      uploadedFileName
    });
    
    await assignment.save();

    const job = await addGenerationJob(assignment._id.toString());
    
    assignment.jobId = job.id;
    await assignment.save();

    res.status(201).json({ success: true, assignmentId: assignment._id, jobId: job.id });
  } catch (error: any) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    await QuestionPaper.deleteMany({ assignmentId: req.params.id });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
