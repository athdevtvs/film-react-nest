import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
})
export class OrderModule {}
