import { Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsRepository } from '../repository/films.repository';
import { ConfigService } from '@nestjs/config';
import { GetFilmDto, GetScheduleDto } from './dto/films.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '../exceptions';

@Injectable()
export class FilmsService {
  constructor(
    private configService: ConfigService,
    private readonly filmsRepository: FilmsRepository,
  ) {}

  private ensureMongoDriver(): void {
    const databaseDriver =
      this.configService.get<AppConfig['database']>('app.database')?.driver;

    if (databaseDriver !== 'mongodb') {
      throw new BadRequestException('Неподдерживаемый драйвер базы данных');
    }
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

  async findAll(): Promise<{ total: number; items: GetFilmDto[] }> {
    this.ensureMongoDriver();
    return this.handleDatabaseOperation(
      () => this.filmsRepository.findAllFilms(),
      'получить все фильмы',
    );
  }

  async findById(
    id: string,
  ): Promise<{ total: number; items: GetScheduleDto[] }> {
    this.ensureMongoDriver();
    return this.handleDatabaseOperation(async () => {
      const result = await this.filmsRepository.findFilmById(id);
      return { total: result.schedule.length, items: result.schedule };
    }, `получить фильм с ID ${id}`);
  }
}
