import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVector } from './entities/product-vector.entity';
import { ProductCategories } from './entities/product-categories.entity';
import { ProductTags } from './entities/product-tags.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Inventory,
      ProductVector,
      ProductCategories, 
      ProductTags,
    ]),
    HttpModule,
  ],
  controllers: [ProductsController, InventoryController],
  providers: [ProductsService, InventoryService],
  exports: [ProductsService, TypeOrmModule], 
})
export class ProductsModule {}
