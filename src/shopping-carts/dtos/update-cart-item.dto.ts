import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'La nueva cantidad del producto en el carrito. Si es 0, el producto se eliminará.',
    example: 2,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}