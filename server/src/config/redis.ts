import Redis from 'ioredis';
import { env } from './env';

class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(env.REDIS_URL, {
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

export const redisClient = RedisClient.getInstance();
