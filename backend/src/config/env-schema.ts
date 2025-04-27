import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  AWS_BUCKET_NAME : z.string(),
  AWS_ACCESS_KEY_ID : z.string(),
  AWS_SECRET_ACCESS_KEY : z.string(),
  AWS_REGION : z.string(),
  SEEDER_ADMIN_USERNAME : z.string().email().nullish(),
  SEEDER_ADMIN_PASSWORD : z.string(),
  SEEDER_CUSTOMER_USERNAME : z.string().email(),
  SEEDER_CUSTOMER_PASSWORD : z.string(),
  WHITE_LIST_URLS: z
    .string()
    .transform(value => value.split(',').map(url => url.trim()))
    .refine(urls => urls.every(url => z.string().url().safeParse(url).success), {
      message: 'Each value in WHITE_LIST_URLS must be a valid URL',
    }),
});

export type EnvVars = z.infer<typeof envSchema>;
