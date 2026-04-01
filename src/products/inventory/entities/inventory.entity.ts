import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../../entities/product.entity';
import { OrderItem } from '../../../orders/entities/order-item.entity';
import { ShoppingCartProduct } from '../../../shopping-carts/entities/shopping-cart-product.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('inventory')
export class Inventory extends BaseEntity {
  @ApiProperty({ description: 'El UUID único de esta variante de inventario.' })
  @PrimaryGeneratedColumn('uuid', { name: 'inventory_id' })
  id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @ApiPropertyOptional({
    description: 'Nombre variable (ej. Sabor, Volumen)',
    example: 'Matcha'
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  variant_name?: string;

  @ApiPropertyOptional({
    description: 'Valor variable (ej.  Fresa, 200ml, etc.)',
    example: 'Matcha'
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  variant_value?: string;

  @ApiPropertyOptional({
    description: 'El SKU único para rastreo.',
    example: 'SKU-12345',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  sku?: string;

  @ApiPropertyOptional({
    description: 'La fecha de vencimiento para esta variante de inventario.',
    example: '2023-12-31',
  })
  @Column({ type: 'date', nullable: true })
  expiration_date?: Date;

  @ApiProperty({ description: 'Cantidad de unidades en stock.' })
  @Column({ type: 'int' })
  stock: number;

  @ApiProperty({ description: 'Precio específico de esta variante.' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product, (product) => product.inventory_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.inventory_item)
  order_items: OrderItem[];

  @OneToMany(
    () => ShoppingCartProduct,
    (cartProduct) => cartProduct.inventory_item,
  )
  shopping_cart_products: ShoppingCartProduct[];
}
