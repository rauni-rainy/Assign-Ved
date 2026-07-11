import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { fetchQuestionPaper } from '../lib/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useGenerationSocket = (assignmentId: string | null) => {
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const setJobProgress = useAssignmentStore((state) => state.setJobProgress);
  const setPaperReady = useAssignmentStore((state) => state.setPaperReady);
  const setFailed = useAssignmentStore((state) => state.setFailed);
  const setCurrentPaper = useAssignmentStore((state) => state.setCurrentPaper);
  const jobProgress = useAssignmentStore((state) => state.jobProgress);
  const clearError = useAssignmentStore((state) => state.clearError);

  useEffect(() => {
    if (!assignmentId) return;

    const socket: Socket = io(SOCKET_URL);

    socket.on('connect', () => {
      socket.emit('join:assignment', { assignmentId });
    });

    socket.on('job:progress', (data) => {
      if (data.assignmentId === assignmentId) {
        setJobProgress(assignmentId, {
          status: 'processing',
          step: data.step,
          percentage: data.percentage,
        });
      }
    });

    socket.on('paper:ready', async (data) => {
      if (data.assignmentId === assignmentId) {
        setPaperReady(assignmentId, data.questionPaperId);
        try {
          const res = await fetchQuestionPaper(assignmentId);
          if (res.success) {
            setCurrentPaper(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch paper after ready event", err);
        }
      }
    });

    socket.on('pdf:ready', (data) => {
      if (data.assignmentId === assignmentId) {
        setPdfReady(true);
        setPdfUrl(data.pdfUrl);
      }
    });

    socket.on('job:failed', (data) => {
      if (data.assignmentId === assignmentId) {
        setFailed(assignmentId, data.error);
      }
    });

    return () => {
      socket.emit('leave:assignment', { assignmentId });
      socket.disconnect();
    };
  }, [assignmentId, setJobProgress, setPaperReady, setFailed, setCurrentPaper]);

  const progressObj = assignmentId ? jobProgress[assignmentId] : null;

  return {
    progress: progressObj,
    step: progressObj?.step || 'Waiting...',
    percentage: progressObj?.percentage || 0,
    isComplete: progressObj?.status === 'completed',
    error: progressObj?.error,
    pdfReady,
    pdfUrl,
    clearError: () => assignmentId && clearError(assignmentId),
  };
};
