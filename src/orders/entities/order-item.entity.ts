import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inventory } from '../../products/inventory/entities/inventory.entity';
import { Order } from './order.entity';

@Entity('orderitems')
export class OrderItem {
  @ApiProperty({ description: 'El UUID único del ítem del pedido.' })
  @PrimaryGeneratedColumn('uuid', { name: 'order_item_id' })
  id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: 'uuid' })
  inventory_id: string;

  @ApiProperty({ description: 'Cantidad de productos comprados.', example: 2 })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ description: 'Precio del producto al momento de la compra.', example: 49.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_purchase: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Inventory, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'inventory_id' })
  inventory_item: Inventory;
}
