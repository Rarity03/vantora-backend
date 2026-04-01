import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn, 
} from 'typeorm';
import { Product } from './product.entity';

@Entity('productvectors')
export class ProductVector {
  @PrimaryColumn({ type: 'uuid' }) 
  product_id: string;

  @OneToOne(() => Product, (product) => product.vector, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'vector' })
  embedding: number[];
}
