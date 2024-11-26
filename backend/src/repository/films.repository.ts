import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetFilmDto, GetScheduleDto } from '../films/dto/films.dto';
import { Film } from '../films/schemas/films.schema';
import { NotFoundException } from '../exceptions';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAllFilms(): Promise<{ total: number; items: GetFilmDto[] }> {
    const [films, total] = await Promise.all([
      this.filmModel.find({}).lean<GetFilmDto[]>(),
      this.filmModel.countDocuments({}),
    ]);
    return { total, items: films };
  }

  async findFilmById(id: string): Promise<GetFilmDto> {
    return await this.filmModel
      .findOne({ id: id })
      .lean<GetFilmDto>()
      .orFail(() => new NotFoundException(`Фильм с ID ${id} не найден`));
  }

  async updateFilmScheduleById(
    id: string,
    schedule: GetScheduleDto[],
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const result = await this.filmModel.updateOne(
      { id: id },
      { $set: { schedule } },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        `Не удалось обновить расписание для фильма с ID ${id}`,
      );
    }

    return result;
  }
}
