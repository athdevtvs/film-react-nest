import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { configProvider } from './app.config.provider';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configProvider],
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      renderPath: '/content/afisha/',
      serveRoot: '/',
    }),
    DatabaseModule.forRootAsync(),
    FilmsModule.forDatabase(),
    OrderModule.forRootAsync(),
  ],
})
export class AppModule {}
