import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('product_categories')
export class ProductCategories {
  @PrimaryColumn({ type: 'uuid' })
  product_id: string;

  @PrimaryColumn({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => Product, (product) => product.category_links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.product_links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
