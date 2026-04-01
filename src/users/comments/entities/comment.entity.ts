import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/core/entities/user.entity';

@Entity('comments')
export class Comment {
  @ApiProperty({ description: 'El UUID único del comentario.' })
  @PrimaryGeneratedColumn('uuid', { name: 'comment_id' })
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @ApiProperty({ description: 'El contenido del comentario.' })
  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ name: 'commented_at' })
  commented_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
