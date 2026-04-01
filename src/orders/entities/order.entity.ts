import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Address } from '../../address/entities/address.entity';
import { Card } from '../../cards/entities/card.entity';
import { User } from '../../users/core/entities/user.entity'; 
import { OrderItem } from './order-item.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @ApiProperty({ description: 'El UUID único del pedido.' })
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  address_id: string;

  @Column({ type: 'uuid' })
  card_id: string;

  @ApiProperty({ description: 'Estado actual del pedido.', example: 'processing' })
  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @ApiProperty({ description: 'Fecha en que se realizó el pedido.' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'order_date' })
  order_date: Date;

  @ApiProperty({ description: 'Precio total del pedido.', example: 129.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @ApiProperty({ description: 'Costo de envío del pedido.', example: 99.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'shipping_cost', default: 0 })
  shipping_cost: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address, (address) => address.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'address_id' })
  shipping_address: Address;

  @ManyToOne(() => Card, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'card_id' })
  payment_card: Card;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToOne(() => Invoice, (invoice) => invoice.order)
  invoice: Invoice;
}
