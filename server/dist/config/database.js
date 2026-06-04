"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000; // Starting delay
const connectDB = async () => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            console.log(`Attempting to connect to MongoDB (Attempt ${retries + 1}/${MAX_RETRIES})...`);
            await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log('✅ Successfully connected to MongoDB.');
            return;
        }
        catch (error) {
            retries++;
            console.error(`❌ MongoDB connection failed: ${error.message}`);
            if (retries >= MAX_RETRIES) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
            const delay = RETRY_DELAY_MS * Math.pow(2, retries - 1); // Exponential backoff
            console.log(`Waiting ${delay}ms before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected.');
});
mongoose_1.default.connection.on('reconnected', () => {
    console.info('✅ MongoDB reconnected.');
});
