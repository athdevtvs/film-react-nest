import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from './order.service';
import { FilmsModule } from '../films/films.module';

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
