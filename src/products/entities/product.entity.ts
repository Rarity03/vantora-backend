import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVector } from './product-vector.entity';
import { ProductCategories } from './product-categories.entity';
import { ProductTags } from './product-tags.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Favorite } from '../../users/favorites/entities/favorite.entity';
import { Comment } from '../../users/comments/entities/comment.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty({ description: 'El UUID único del producto.' })
  @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
  id: string;

  @ApiProperty({ description: 'Nombre del producto.' })
  @Column({ type: 'varchar', length: 255 })
  product_name: string;

  @ApiPropertyOptional({ description: 'Descripción detallada del producto.' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiPropertyOptional({ description: 'Tipo de producto (ej. Snack, Bebida, Papelería, Coleccionable).' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo: string;

  @ApiPropertyOptional({ description: 'Marca del producto.' })
  @Column({ type: 'varchar', length: 100, nullable: true }) 
  brand: string;

  @ApiPropertyOptional({ description: 'País de origen del producto.' })
  @Column({ type: 'varchar', length: 100, nullable: true }) 
  origin_country: string;

  @ApiPropertyOptional({ description: 'Peso del producto en gramos.', example: 250 })
  @Column({ type: 'int', nullable: true })
  weight_grams?: number;

  @ApiPropertyOptional({
    description: 'Indica si el producto es perecedero.',
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  is_perishable?: boolean;

  @ApiProperty({ description: 'URL de la imagen principal del producto.' })
  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @OneToOne(() => ProductVector, (vector) => vector.product)
  vector: ProductVector;

  @OneToMany(() => Inventory, (item) => item.product)
  inventory_items: Inventory[];

  @OneToMany(
    () => ProductCategories,
    (productCategory) => productCategory.product,
  )
  category_links: ProductCategories[];

  @OneToMany(
    () => ProductTags,
    (productTags) => productTags.product,
  )
  tag_links: ProductTags[];

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];
}
