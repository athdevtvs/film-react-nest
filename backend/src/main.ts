import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DevLogger, JsonLogger, TskvLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerType = process.env.LOGGER?.toLowerCase() ?? 'dev';

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const loggerMap = {
    dev: new DevLogger(),
    json: new JsonLogger(),
    tskv: new TskvLogger(),
  };
  const logger = loggerMap[loggerType];

  if (logger) {
    app.useLogger(logger);
  } else {
    console.warn(
      `Неверный тип логгера: ${loggerType}. Используем по умолчанию логгер 'dev'.`,
    );
    app.useLogger(new DevLogger());
  }

  await app.listen(3000);
}
bootstrap();
