import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsUrl,
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateInventoryDto } from '../inventory/dto/create-inventory.dto';
import { CreateProductVectorDto } from './create-product-vector.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Camiseta Deportiva Elite',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  product_name: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional del producto',
    example: 'Camiseta de alto rendimiento para entrenamientos intensos.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
  })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiPropertyOptional({
    description: 'Marca del producto',
    example: 'Adidas',
  })
  @IsString()
  @IsOptional()
  brand?: string;
  
  @ApiPropertyOptional({
    description: 'País del producto',
    example: 'Italia',
  })
  @IsString()
  @IsOptional()
  origin_country?: string;

  @ApiPropertyOptional({
    description: 'Peso del producto en gramos.',
    example: 250,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  weight_grams?: number;

  @ApiPropertyOptional({
    description:
      'Indica si el producto es perecedero.',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_perishable?: boolean;

  @ApiProperty({
    description: 'Url de la imagen del producto',
    example: 'https://example.com/product_main.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image_url: string;

  @ApiProperty({
    type: [String],
    description: 'An array of IDs for the categories this product belongs to',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  })
  @IsArray()
  @ArrayMinSize(1) 
  @IsUUID('4', { each: true }) 
  @IsNotEmpty({ each: true }) 
  category_ids: string[];

  @ApiProperty({
    type: [String],
    description: 'An array of IDs for the styles this product belongs to',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  tag_ids: string[];

  @ApiProperty({
    type: [CreateInventoryDto],
    description:
      'List of inventory variants (size, color, stock) for the product',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryDto)
  inventory_items: CreateInventoryDto[];

  @ApiPropertyOptional({
    type: [CreateProductVectorDto],
    description: 'Additional images/vectors for the product',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVectorDto)
  additional_vectors?: CreateProductVectorDto[];
}
