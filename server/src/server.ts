import { createServer } from 'http';
import { app } from './app';
import { env } from './config/env';
import { connectDB } from './config/database';
import './config/redis'; // Initialize Redis connection
import { initSocketServer } from './websocket/socketServer';
import { aiWorker } from './workers/aiWorker';
import { pdfWorker } from './workers/pdfWorker';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Setup HTTP Server
    const httpServer = createServer(app);

    // 3. Setup Socket.io
    initSocketServer(httpServer);

    // 4. Start Workers
    aiWorker.run();
    pdfWorker.run();
    console.log('👷 Workers started');

    // 5. Start Server
    httpServer.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      // Let it crash or handle gracefully
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
