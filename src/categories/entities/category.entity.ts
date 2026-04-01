import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategories } from '../../products/entities/product-categories.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category extends BaseEntity {
  @ApiProperty({
    description: 'El UUID único que identifica a la categoría.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  id: string;

  @ApiProperty({
    description: 'El nombre único de la categoría.',
    example: 'Ropa Deportiva',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({
    description: 'Una descripción opcional para la categoría.',
    example: 'Indumentaria para actividades físicas',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(
    () => ProductCategories,
    (productCategory) => productCategory.category,
  )
  product_links: ProductCategories[];
}
