import { Server } from 'socket.io';
import { env } from '../config/env';

let io: Server;

export const initSocketServer = (httpServer: any) => {
  const allowedOrigins = env.FRONTEND_URL.split(',').map((url) => url.trim());

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:assignment', ({ assignmentId }) => {
      if (assignmentId) {
        socket.join(`assignment:${assignmentId}`);
        console.log(`Socket ${socket.id} joined room assignment:${assignmentId}`);
      }
    });

    socket.on('leave:assignment', ({ assignmentId }) => {
      if (assignmentId) {
        socket.leave(`assignment:${assignmentId}`);
        console.log(`Socket ${socket.id} left room assignment:${assignmentId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitToAssignment = (assignmentId: string, event: string, data: object) => {
  getIO().to(`assignment:${assignmentId}`).emit(event, data);
};
