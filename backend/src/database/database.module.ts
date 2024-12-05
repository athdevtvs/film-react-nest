import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from 'src/app.config.provider';

@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    const databaseDriver = process.env.DATABASE_DRIVER;

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

    throw new Error(`Unsupported database driver: ${databaseDriver}`);
  }
}
