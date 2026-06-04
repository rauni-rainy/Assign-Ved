import { Router } from 'express';
import { QuestionPaper } from '../models/QuestionPaper';
import { addGenerationJob } from '../queues/assignmentQueue';

const router = Router();

router.get('/:assignmentId', async (req, res, next) => {
  try {
    // Find latest QuestionPaper for assignmentId
    const paper = await QuestionPaper.findOne({ assignmentId: req.params.assignmentId })
      .select('+sections.questions.expectedAnswer')
      .sort({ version: -1 });
    
    if (!paper) {
      const { Assignment } = await import('../models/Assignment');
      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        return res.status(404).json({ success: false, message: 'Assignment not found' });
      }
      return res.status(202).json({ success: true, status: 'generating', message: 'Paper is being generated' });
    }

    if (paper.status === 'generating') {
      return res.status(202).json({ success: true, status: 'generating', message: 'Paper is being generated' });
    }

    res.json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
});

router.get('/assignment/:assignmentId/versions', async (req, res, next) => {
  try {
    const versions = await QuestionPaper.find({ assignmentId: req.params.assignmentId })
      .select('_id version createdAt status')
      .sort({ version: -1 });
    
    res.json({ success: true, data: versions });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/with-answers', async (req, res, next) => {
  try {
    const token = req.headers['x-teacher-token'];
    if (token !== 'demo-token') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const paper = await QuestionPaper.findById(req.params.id).select('+sections.questions.expectedAnswer');
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    
    res.json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/regenerate', async (req, res, next) => {
  try {
    const oldPaper = await QuestionPaper.findById(req.params.id);
    if (!oldPaper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    const newPaper = new QuestionPaper({
      assignmentId: oldPaper.assignmentId,
      version: oldPaper.version + 1,
      status: 'generating'
    });
    await newPaper.save();

    const job = await addGenerationJob(oldPaper.assignmentId.toString());

    res.status(202).json({ success: true, jobId: job.id });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/download', async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    const includeAnswers = req.query.includeAnswers === 'true';
    const filePath = includeAnswers && paper.teacherPdfPath ? paper.teacherPdfPath : paper.pdfPath;

    if (!filePath) {
      return res.status(404).json({ success: false, message: 'PDF not yet generated' });
    }

    const filename = includeAnswers 
      ? `question-paper-${paper.metadata?.subject || 'subject'}-grade${paper.metadata?.grade || 'grade'}-teacher.pdf`
      : `question-paper-${paper.metadata?.subject || 'subject'}-grade${paper.metadata?.grade || 'grade'}.pdf`;
      
    res.download(filePath, filename);
  } catch (error) {
    next(error);
  }
});

export default router;
