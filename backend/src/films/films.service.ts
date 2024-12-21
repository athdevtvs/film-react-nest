import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InternalServerErrorException } from '../exceptions';
import { AppConfig } from '../app.config.provider';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsRepositoryPostgres } from '../repository/films.repository.postgres';

import { GetFilmDto, GetScheduleDto } from './dto/films.dto';
import { Films } from './entities/film.entity';
import { Schedules } from './entities/schedule.entity';

@Injectable()
export class FilmsService {
  private readonly databaseDriver: string;

  constructor(
    private configService: ConfigService,
    @Inject('FILM_REPOSITORY')
    private readonly filmsRepository: FilmsRepository | FilmsRepositoryPostgres,
  ) {
    this.databaseDriver =
      this.configService.get<AppConfig['database']>('app.database')?.driver;
  }

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
    operationDescription: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw new InternalServerErrorException(
        `Не удалось ${operationDescription}. Ошибка: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<{ total: number; items: GetFilmDto[] | Films[] }> {
    return this.handleDatabaseOperation(
      () => this.filmsRepository.findAllFilms(),
      'получить все фильмы',
    );
  }

  async findById(
    id: string,
  ): Promise<{ total: number; items: GetScheduleDto[] | Schedules[] }> {
    return this.handleDatabaseOperation(async () => {
      const result = await this.filmsRepository.findFilmById(id);
      if (result && result.schedule) {
        return { total: result.schedule.length, items: result.schedule };
      }
      return { total: 0, items: [] };
    }, `получить фильм с ID ${id}`);
  }
}
