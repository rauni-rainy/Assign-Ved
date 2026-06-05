"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToAssignment = exports.getIO = exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
let io;
const initSocketServer = (httpServer) => {
    const allowedOrigins = env_1.env.FRONTEND_URL.split(',').map((url) => url.trim());
    io = new socket_io_1.Server(httpServer, {
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
exports.initSocketServer = initSocketServer;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.getIO = getIO;
const emitToAssignment = (assignmentId, event, data) => {
    (0, exports.getIO)().to(`assignment:${assignmentId}`).emit(event, data);
};
exports.emitToAssignment = emitToAssignment;
