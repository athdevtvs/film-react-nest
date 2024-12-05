import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Film, FilmSchema } from './schemas/films.schema';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsRepositoryPostgres } from '../repository/films.repository.postgres';
import { Films } from './entities/film.entity';

@Module({})
export class FilmsModule {
  static forDatabase(): DynamicModule {
    const isMongo = process.env.DATABASE_DRIVER === 'mongodb';

    return {
      module: FilmsModule,
      imports: isMongo
        ? [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])]
        : [TypeOrmModule.forFeature([Films])],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        isMongo
          ? { provide: 'FILM_REPOSITORY', useClass: FilmsRepository }
          : { provide: 'FILM_REPOSITORY', useClass: FilmsRepositoryPostgres },
      ],
      exports: ['FILM_REPOSITORY'],
    };
  }
}
