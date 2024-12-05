import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../app.config.provider';
import { Film, FilmSchema } from './schemas/films.schema';
import { FilmsController } from './films.controller';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsService } from './films.service';

@Module({})
export class FilmsModule {
  static databaseDriver: string;

  constructor(private configService: ConfigService) {
    FilmsModule.databaseDriver =
      this.configService.get<AppConfig['database']>('app.database')?.driver;
  }

  static forDatabase(): DynamicModule {
    const isMongo = this.databaseDriver === 'mongodb';

    return {
      module: FilmsModule,
      imports: [
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        { provide: 'FILM_REPOSITORY', useClass: FilmsRepository },
      ],
      exports: ['FILM_REPOSITORY'],
    };
  }
}
