import fs from 'fs';
import dotenv from 'dotenv';

import { envSchema, EnvVars } from './env-schema';

// eslint-disable-next-line node/no-process-env
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  // eslint-disable-next-line node/no-process-env
  console.log(`✅ Loaded environment: ${envFile}\nNODE_ENV: ${process.env.NODE_ENV}`);
} else {
  console.warn(`⚠️ Warning: Environment file "${envFile}" not found. Using defaults.`);
}

// eslint-disable-next-line node/no-process-env
const parsedEnv = envSchema.safeParse(process.env);
// eslint-disable-next-line node/no-process-env
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.format();
  const missingKeys = Object.keys(formattedErrors).filter(key => key !== '_errors');

  console.error(
    `❌ Missing environment variables in "${NODE_ENV}" .env file:\n${missingKeys.join(', ')}`,
  );
  process.exit(1); // Stop execution if required env variables are missing
}

console.log(`Loaded environment: .env.${NODE_ENV}`);

export const env: EnvVars = parsedEnv.data;
