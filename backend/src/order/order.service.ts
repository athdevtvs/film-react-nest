import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '../exceptions';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsRepositoryPostgres } from '../repository/films.repository.postgres';
import { OrderRepository } from '../repository/order.repository';
import { AppConfig } from 'src/app.config.provider';

import { GetFilmDto } from '../films/dto/films.dto';
import { CreateOrderDto, GetTicketDto } from './dto/order.dto';
import { Schedules } from 'src/films/entities/schedule.entity';

@Injectable()
export class OrderService {
  private readonly databaseDriver: string;

  constructor(
    private configService: ConfigService,
    @Inject('FILM_REPOSITORY')
    private readonly filmsRepository: FilmsRepository | FilmsRepositoryPostgres,
    private readonly ordersRepository: OrderRepository,
  ) {
    this.databaseDriver =
      this.configService.get<AppConfig['database']>('app.database')?.driver;
  }

  private async getFilmsByTickets(
    tickets: CreateOrderDto['tickets'],
  ): Promise<GetFilmDto[]> {
    const filmIds = Array.from(new Set(tickets.map((ticket) => ticket.film)));
    const filmPromises = filmIds.map((filmId) =>
      this.filmsRepository.findFilmById(filmId),
    );
    return Promise.all(filmPromises);
  }

  private validateTickets(
    tickets: CreateOrderDto['tickets'],
    films: GetFilmDto[],
  ): void {
    for (const ticket of tickets) {
      const film = films.find((f) => f.id === ticket.film);
      if (!film) {
        throw new NotFoundException(`Не найден фильм с ID ${ticket.film}`);
      }

      const schedule = film.schedule.find(
        (s) => s.id === ticket.session && s.daytime === ticket.daytime,
      );

      if (!schedule) {
        throw new BadRequestException(
          `Неверный сеанс или время для билета: ID фильма ${ticket.film}, ID сеанса ${ticket.session}`,
        );
      }

      if (schedule.taken.includes(`${ticket.row}:${ticket.seat}`)) {
        throw new ConflictException(
          `Место ${ticket.row}:${ticket.seat} уже занято для фильма с ID ${ticket.film} и сессии с ID ${ticket.session}`,
        );
      }
    }
  }

  private async updateTakenSeats(
    tickets: CreateOrderDto['tickets'],
    films: GetFilmDto[],
    orderData?: CreateOrderDto,
  ): Promise<void> {
    for (const ticket of tickets) {
      const film = films.find((f) => f.id === ticket.film);
      if (!film) continue;

      const schedule = film.schedule.find((s) => s.daytime === ticket.daytime);

      if (schedule) {
        let takenSeats: string[] = [];

        if (typeof schedule.taken === 'string') {
          takenSeats = schedule.taken.split(',');
        } else if (Array.isArray(schedule.taken)) {
          takenSeats = schedule.taken;
        }

        if (this.databaseDriver === 'postgres') {
          const newSeats = orderData
            ? orderData.getOrderData.flatMap((order) => order.seatsSelection)
            : [];

          const sanitizedTakenSeats = takenSeats.filter(
            (seat) => seat.trim() !== '',
          );

          const updatedTakenSeats = Array.from(
            new Set([...sanitizedTakenSeats, ...newSeats]),
          );

          schedule.taken = updatedTakenSeats.join(',');
        } else if (this.databaseDriver === 'mongodb') {
          tickets.forEach((t) => {
            takenSeats.push(`${t.row}:${t.seat}`);
          });

          schedule.taken = takenSeats;
        }

        await this.filmsRepository.updateFilmScheduleById(
          ticket.film,
          film.schedule as Schedules[],
        );
      }
    }
  }

  async placeOrder(
    createOrderDto: Omit<CreateOrderDto, 'id'>,
  ): Promise<{ total: number; items: GetTicketDto[] }> {
    const films = await this.getFilmsByTickets(createOrderDto.tickets);

    this.validateTickets(createOrderDto.tickets, films);

    const order = this.ordersRepository.createOrder({
      ...createOrderDto,
    });

    await this.updateTakenSeats(createOrderDto.tickets, films, order);

    return {
      total: order.tickets.length,
      items: order.tickets,
    };
  }
}
