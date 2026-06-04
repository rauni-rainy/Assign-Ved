"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
class RedisClient {
    constructor() { }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new ioredis_1.default(env_1.env.REDIS_URL, {
                maxRetriesPerRequest: null,
            });
            RedisClient.instance.on('connect', () => {
                console.log('✅ Successfully connected to Redis.');
            });
            RedisClient.instance.on('error', (error) => {
                console.error(`❌ Redis connection error: ${error.message}`);
            });
        }
        return RedisClient.instance;
    }
}
exports.redisClient = RedisClient.getInstance();
