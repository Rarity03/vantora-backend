import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsUUID, Matches } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    description: 'El UUID de la dirección de facturación asociada.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  address_id: string;

  @ApiProperty({
    description: 'Token de la tarjeta, generado por el proveedor de pagos.',
    example: 'tok_1J2w3e4r5t6y7u8i9o0p',
  })
  @IsString()
  @IsNotEmpty()
  card_token: string;

  @ApiProperty({ description: 'Últimos 4 dígitos de la tarjeta.', example: '4242' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'Debe ser una cadena de 4 dígitos.' })
  last_four_digits: string;

  @ApiProperty({ description: 'Fecha de expiración en formato MM/YYYY.', example: '12/28' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'El formato debe ser MM/YY' })
  exp_date: string;

  @ApiPropertyOptional({ description: 'Tipo de tarjeta.', example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  card_type: string;

  @ApiProperty({ description: 'Nombre completo del titular de la tarjeta.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  card_holder_name: string;
}