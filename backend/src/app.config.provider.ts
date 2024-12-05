import { registerAs } from '@nestjs/config';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export const configProvider = registerAs<AppConfig>('app', () => {
  const driver = process.env.DATABASE_DRIVER ?? 'postgres';
  const url =
    process.env.DATABASE_URL ??
    (driver === 'postgres'
      ? 'postgres://prac:test@localhost:5432/prac'
      : 'mongodb://localhost:27017/afisha');

  return {
    database: {
      driver,
      url,
    },
  };
});
