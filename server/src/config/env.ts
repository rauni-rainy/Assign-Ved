import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
  PORT: z.string().default('3001'),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  FRONTEND_URL: z.string().min(1), // Can be comma-separated URLs
  PDF_OUTPUT_DIR: z.string().default('./pdfs'),
  MAX_JOBS_PER_HOUR: z.coerce.number().default(100),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
