"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const health_1 = __importDefault(require("./routes/health"));
const assignments_1 = __importDefault(require("./routes/assignments"));
const questionPapers_1 = __importDefault(require("./routes/questionPapers"));
const app = (0, express_1.default)();
exports.app = app;
// Middleware
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/health', health_1.default);
app.use('/api/assignments', assignments_1.default);
app.use('/api/question-papers', questionPapers_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
