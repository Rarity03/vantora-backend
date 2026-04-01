import {
  IsArray,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductVectorDto {
  @ApiProperty({
    description:
      'El vector de 512 dimensiones que representa la imagen y descripción del producto.',
    type: [Number],
    example: [0.1, 0.2, 0.3, 0.9],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(512)
  @ArrayMaxSize(512)
  embedding: number[];
}
