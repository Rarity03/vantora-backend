import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiPropertyOptional({
    description: 'Nombre variable (ej. Sabor, Volumen)',
    example: 'Matcha',
  })
  @IsString()
  @IsOptional()
  variant_name?: string;

  @ApiPropertyOptional({
    description: 'Valor variable (ej.  Fresa, 200ml, etc.)',
    example: 'Matcha',
  })
  @IsString()
  @IsOptional()
  variant_value?: string;

  @ApiPropertyOptional({
    description: 'El SKU para rastreo.',
    example: 'SKU-12345',
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({
    description: 'La fecha de vencimiento para esta variante de inventario.',
    example: '2023-12-31',
  })
  @IsDateString()
  @IsOptional()
  expiration_date?: Date;

  @ApiProperty({
    description: 'La cantidad disponible en stock para esta variante.',
    example: 100,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'El precio de venta de esta variante.',
    example: 29.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}
