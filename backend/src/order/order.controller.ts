import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, PlaceTicketDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() order: CreateOrderDto,
  ): Promise<{ total: number; items: PlaceTicketDto[] }> {
    return await this.orderService.placeOrder(order);
  }
}
