import dotenv from 'dotenv';

dotenv.config();

const requiredEnvs = ['PORT'] as const; 

for (const envVar of requiredEnvs) {
  if (!process.env[envVar]) {
    console.error(`ERROR: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export const config = {
  port: parseInt(process.env.PORT as string),
  nodeEnv: process.env.NODE_ENV || 'development',
};