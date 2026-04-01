import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../core/entities/user.entity';
import { Product } from '../../../products/entities/product.entity';

@Entity('favorites')
@Unique(['user_id', 'product_id'])
export class Favorite extends BaseEntity {
  @ApiProperty({ description: 'El UUID único del favorito.' })
  @PrimaryGeneratedColumn('uuid', { name: 'favorite_id' })
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
