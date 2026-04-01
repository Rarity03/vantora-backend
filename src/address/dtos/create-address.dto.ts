import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Nombre de la calle', example: 'Av. Siempre Viva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street_name: string;

  @ApiPropertyOptional({ description: 'Número exterior o interior', example: '742' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  number?: string;

  @ApiProperty({ description: 'Ciudad', example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ description: 'Estado o provincia', example: 'Illinois' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @ApiProperty({ description: 'País', example: 'EE. UU.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @ApiProperty({ description: 'Código postal', example: '62620' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postal_code: string;
}
