import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('product_tags')
export class ProductTags {
  @PrimaryColumn({ type: 'uuid' })
  product_id: string;

  @PrimaryColumn({ type: 'uuid' })
  tag_id: string;

  @ManyToOne(() => Product, (product) => product.tag_links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Tag, (tag) => tag.product_links, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}