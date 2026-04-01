import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCartsService } from './shopping-carts.service';
import { ShoppingCartsController } from './shopping-carts.controller';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartProduct } from './entities/shopping-cart-product.entity';
import { User } from '../users/core/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShoppingCart,
      ShoppingCartProduct,
      User, 
    ]),
  ],
  controllers: [ShoppingCartsController],
  providers: [ShoppingCartsService],
  exports: [ShoppingCartsService, TypeOrmModule], 
})
export class ShoppingCartsModule {}