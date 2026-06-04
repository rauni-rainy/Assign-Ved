"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("../config/redis");
const assignmentQueue_1 = require("../queues/assignmentQueue");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        const questionQueueCounts = await assignmentQueue_1.questionGenerationQueue.getJobCounts();
        const pdfQueueCounts = await assignmentQueue_1.pdfGenerationQueue.getJobCounts();
        res.json({
            success: true,
            data: {
                database: {
                    readyState: mongoose_1.default.connection.readyState,
                    status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose_1.default.connection.readyState] || 'unknown'
                },
                redis: {
                    status: redis_1.redisClient.status
                },
                queues: {
                    questionGeneration: questionQueueCounts,
                    pdfGeneration: pdfQueueCounts
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
