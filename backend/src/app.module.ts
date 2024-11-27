import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { configProvider, AppConfig } from './app.config.provider';
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<AppConfig['database']>('app.database')?.url,
        };
      },
      inject: [ConfigService],
    }),
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
