import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { configProvider } from '../app.config.provider';
import { Film, FilmSchema } from './schemas/films.schema';
import { FilmsController } from './films.controller';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsService } from './films.service';

@Module({
  imports: [
    ConfigModule.forFeature(configProvider),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsRepository, FilmsService],
  exports: [FilmsRepository],
})
export class FilmsModule {}
