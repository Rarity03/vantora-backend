import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'El nuevo estado del pedido',
    example: 'shipped',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status: string;
}
