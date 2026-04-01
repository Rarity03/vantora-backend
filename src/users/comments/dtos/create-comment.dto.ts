import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'El contenido del comentario.', example: '¡Esta camiseta es increíble!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  text: string;
}
