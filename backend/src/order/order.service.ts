import { Injectable } from '@nestjs/common';
//import { v4 as uuidv4 } from 'uuid';
import { GetFilmDto } from '../films/dto/films.dto';
import { CreateOrderDto, PlaceTicketDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { OrderRepository } from '../repository/order.repository';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '../exceptions';

@Injectable()
export class OrderService {
  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly ordersRepository: OrderRepository,
  ) {}

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
  ): Promise<void> {
    for (const ticket of tickets) {
      const film = films.find((f) => f.id === ticket.film);
      if (!film) continue;

      const schedule = film.schedule.find(
        (s) => s.id === ticket.session && s.daytime === ticket.daytime,
      );

      if (schedule) {
        schedule.taken.push(`${ticket.row}:${ticket.seat}`);
        await this.filmsRepository.updateFilmScheduleById(
          ticket.film,
          film.schedule,
        );
      }
    }
  }

  async placeOrder(
    createOrderDto: Omit<CreateOrderDto, 'id'>,
  ): Promise<{ total: number; items: PlaceTicketDto[] }> {
    const films = await this.getFilmsByTickets(createOrderDto.tickets);

    this.validateTickets(createOrderDto.tickets, films);

    const order = this.ordersRepository.createOrder({
      ...createOrderDto,
    });

    await this.updateTakenSeats(createOrderDto.tickets, films);

    return {
      total: order.tickets.length,
      items: order.orderData,
    };
  }
}
