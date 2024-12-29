import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from 'src/app.config.provider';
import { Films } from '../films/entities/film.entity';
import { Schedules } from '../films/entities/schedule.entity';

@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    const databaseDriver = process.env.DATABASE_DRIVER ?? 'postgres';

    if (databaseDriver === 'postgres') {
      return {
        module: DatabaseModule,
        imports: [
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const dbConfig =
                configService.get<AppConfig['database']>('app.database');
              return {
                type: 'postgres',
                url: dbConfig.url,
                autoLoadEntities: true,
                entities: [Films, Schedules],
                synchronize: false,
                retryAttempts: 3,
              };
            },
          }),
        ],
        exports: [TypeOrmModule],
      };
    } else if (databaseDriver === 'mongodb') {
      return {
        module: DatabaseModule,
        imports: [
          MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const dbConfig =
                configService.get<AppConfig['database']>('app.database');
              return {
                uri: dbConfig.url,
                retryAttempts: 3,
              };
            },
          }),
        ],
        exports: [MongooseModule],
      };
    }

    throw new Error(`Неподдерживаемый драйвер базы данных: ${databaseDriver}`);
  }
}
