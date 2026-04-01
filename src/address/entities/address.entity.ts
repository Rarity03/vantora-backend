import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Card } from '../../cards/entities/card.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/core/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @ApiProperty({ description: 'El UUID único de la dirección.' })
  @PrimaryGeneratedColumn('uuid', { name: 'address_id' })
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({ description: 'Nombre de la calle.' })
  @Column({ type: 'varchar', length: 255 })
  street_name: string;

  @ApiPropertyOptional({ description: 'Número exterior o interior.' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  number: string;

  @ApiProperty({ description: 'Ciudad.' })
  @Column({ type: 'varchar', length: 100 })
  city: string;

  @ApiProperty({ description: 'Estado o provincia.' })
  @Column({ type: 'varchar', length: 100 })
  state: string;

  @ApiProperty({ description: 'País.' })
  @Column({ type: 'varchar', length: 100 })
  country: string;

  @ApiProperty({ description: 'Código postal.' })
  @Column({ type: 'varchar', length: 20 })
  postal_code: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Card, (card) => card.billing_address)
  cards: Card[];

  @OneToMany(() => Order, (order) => order.shipping_address)
  orders: Order[];
}
