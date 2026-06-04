"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3001'),
    MONGODB_URI: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    GEMINI_API_KEY: zod_1.z.string().min(1),
    FRONTEND_URL: zod_1.z.string().url(),
    PDF_OUTPUT_DIR: zod_1.z.string().default('./pdfs'),
    MAX_JOBS_PER_HOUR: zod_1.z.coerce.number().default(100),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(_env.error.format(), null, 2));
    process.exit(1);
}
exports.env = _env.data;
