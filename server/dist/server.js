"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
require("./config/redis"); // Initialize Redis connection
const socketServer_1 = require("./websocket/socketServer");
const aiWorker_1 = require("./workers/aiWorker");
const pdfWorker_1 = require("./workers/pdfWorker");
const startServer = async () => {
    try {
        // 1. Connect to Database
        await (0, database_1.connectDB)();
        // 2. Setup HTTP Server
        const httpServer = (0, http_1.createServer)(app_1.app);
        // 3. Setup Socket.io
        (0, socketServer_1.initSocketServer)(httpServer);
        // 4. Start Workers
        aiWorker_1.aiWorker.run();
        pdfWorker_1.pdfWorker.run();
        console.log('👷 Workers started');
        // 5. Start Server
        httpServer.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
        });
        // Handle Unhandled Rejections
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err);
            // Let it crash or handle gracefully
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
