import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderRepository } from '../repository/order.repository';
import { FilmsModule } from '../films/films.module';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({})
export class OrderModule {
  static forRootAsync(): DynamicModule {
    return {
      module: OrderModule,
      imports: [ConfigModule, FilmsModule.forDatabase()],
      controllers: [OrderController],
      providers: [OrderRepository, OrderService],
    };
  }
}
