import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; 

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Ropa Deportiva',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the category',
    example: 'Indumentaria para actividades físicas',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

}
