import { IsNotEmpty, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
  @ApiProperty({
    description: 'The ID of the inventory item (variant) to add',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  inventory_id: string;

  @ApiProperty({ description: 'The quantity of the item to add', example: 1 })
  @IsInt()
  @Min(1) 
  @IsNotEmpty()
  quantity: number;
}
