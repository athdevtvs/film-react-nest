import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CreateOrderDto, GetTicketDto } from '../order/dto/order.dto';
import { BadRequestException } from '../exceptions';

@Injectable()
export class OrderRepository {
  private orders: CreateOrderDto[] = [];

  private areTicketsEqual(
    ticket: GetTicketDto,
    existingTicket: GetTicketDto,
  ): boolean {
    return (
      ticket.film === existingTicket.film &&
      ticket.session === existingTicket.session &&
      ticket.daytime === existingTicket.daytime &&
      ticket.row === existingTicket.row &&
      ticket.seat === existingTicket.seat
    );
  }

  private ensureNoDuplicateTickets(tickets: GetTicketDto[]): void {
    const allExistingTickets = this.orders.flatMap((order) => order.tickets);

    for (const ticket of tickets) {
      const duplicate = allExistingTickets.find((existingTicket) =>
        this.areTicketsEqual(ticket, existingTicket),
      );
      if (duplicate) {
        throw new BadRequestException(
          `Duplicate ticket detected: ${JSON.stringify(ticket)}`,
        );
      }
    }
  }

  private generateTicketsWithId(tickets: GetTicketDto[]): GetTicketDto[] {
    return tickets.map((ticket) => ({
      ...ticket,
      id: faker.string.uuid(),
    }));
  }

  createOrder(order: Omit<CreateOrderDto, 'id'>): CreateOrderDto {
    this.ensureNoDuplicateTickets(order.tickets);

    const ticketsWithId = this.generateTicketsWithId(order.tickets);

    const newOrder = new CreateOrderDto();
    newOrder.id = faker.string.uuid();
    newOrder.email = order.email;
    newOrder.phone = order.phone;
    newOrder.tickets = ticketsWithId;

    this.orders.push(newOrder);

    return newOrder;
  }
}
