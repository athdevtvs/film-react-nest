import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

import {
  GetFilmDto,
  FilmScheduleParams,
  GetScheduleDto,
} from './dto/films.dto';
import { Films } from './entities/film.entity';
import { Schedules } from './entities/schedule.entity';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('/')
  getFilms(): Promise<{ total: number; items: GetFilmDto[] | Films[] }> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  getFilmSchedule(
    @Param() params: FilmScheduleParams,
  ): Promise<{ total: number; items: GetScheduleDto[] | Schedules[] }> {
    return this.filmsService.findById(params.id);
  }
}
