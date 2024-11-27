import { registerAs } from '@nestjs/config';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export const configProvider = registerAs<AppConfig>('app', () => ({
  database: {
    url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/afisha',
    driver: process.env.DATABASE_DRIVER ?? 'mongodb',
  },
}));
