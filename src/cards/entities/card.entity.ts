import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/core/entities/user.entity';
import { Address } from '../../address/entities/address.entity';

@Entity('card')
export class Card extends BaseEntity {
  @ApiProperty({ description: 'El UUID único de la tarjeta.' })
  @PrimaryGeneratedColumn('uuid', { name: 'card_id' })
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({ description: 'Token que representa la tarjeta.' })
  @Column({ type: 'varchar', length: 255, name: 'card_token' })
  card_token: string;

  @ApiProperty({ description: 'Últimos 4 dígitos de la tarjeta.', example: '4242' })
  @Column({ type: 'varchar', length: 4, name: 'last_four_digits' })
  last_four_digits: string;

  @ApiProperty({ description: 'Fecha de expiración en formato MM/YYYY.', example: '12/28' })
  @Column({ type: 'varchar', length: 7, name: 'exp_date' })
  exp_date: string;

  @ApiProperty({ description: 'Nombre del titular de la tarjeta.' })
  @Column({ type: 'varchar', length: 255, name: 'card_holder_name' })
  card_holder_name: string;

  @ApiPropertyOptional({ description: 'Tipo de tarjeta' })
  @Column({ type: 'varchar', length: 50, name: 'card_type', nullable: true })
  card_type: string;

  @ApiPropertyOptional({ description: 'Indica si la tarjeta es la predeterminada para el usuario.' })
  @Column({ type: 'boolean', name: 'is_default', default: false })
  is_default: boolean;

  @Column({ type: 'uuid' })
  address_id: string;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address, (address) => address.cards, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'address_id' })
  billing_address: Address;
}
