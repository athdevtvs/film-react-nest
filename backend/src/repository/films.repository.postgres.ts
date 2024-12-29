import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Films } from '../films/entities/film.entity';
import { Schedules } from 'src/films/entities/schedule.entity';
import { NotFoundException } from '../exceptions';

@Injectable()
export class FilmsRepositoryPostgres {
  constructor(
    @InjectRepository(Films)
    private readonly filmsRepository: Repository<Films>,
  ) {}

  async findAllFilms(): Promise<{
    total: number;
    items: Films[];
  }> {
    const [films, total] = await Promise.all([
      this.filmsRepository.find(),
      this.filmsRepository.count(),
    ]);

    return { total, items: films };
  }

  async findFilmById(id: string): Promise<Films> {
    const film = await this.filmsRepository.findOne({
      where: { id: id },
      relations: { schedule: true },
    });

    if (!film) {
      throw new NotFoundException(`Фильм с ID ${id} не найден`);
    }

    return film;
  }

  async updateFilmScheduleById(
    id: string,
    schedule: Schedules[],
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

    if (!film) {
      throw new NotFoundException(
        `Не удалось обновить расписание для фильма с ID ${id}`,
      );
    }

    film.schedule = schedule;
    await this.filmsRepository.save(film);

    return { acknowledged: true, modifiedCount: schedule.length };
  }
}
