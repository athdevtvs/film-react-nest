import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';
import { configProvider, AppConfig } from './app.config.provider';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configProvider],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<AppConfig['database']>('app.database')?.url,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    FilmsModule,
  ],
})
export class AppModule {}
