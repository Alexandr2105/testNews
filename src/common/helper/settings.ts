import { config } from 'dotenv';
config();

export const settings = {
  JWT_SECRET: process.env.JWT_SECRET || '1234',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '12345',
  TOKEN_LIFE: 180,
  REFRESH_TOKEN_LIFE: '3 days',
  CURRENT_APP_BASE_URL:
    process.env.CURRENT_APP_BASE_URL || 'https://localhost:3000',
};
