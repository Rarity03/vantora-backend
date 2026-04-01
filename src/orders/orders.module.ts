import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController, OrdersManageController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { ShoppingCart } from '../shopping-carts/entities/shopping-cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Invoice,
      ShoppingCart,
    ]),
  ],
  controllers: [OrdersController, OrdersManageController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
