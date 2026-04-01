import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'El UUID de la dirección de envío del usuario.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  shipping_address_id: string;

  @ApiProperty({
    description: 'El UUID de la tarjeta de pago del usuario.',
    example: 'c1d2e3f4-a5b6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  card_id: string;

  @ApiProperty({
    description: 'El costo de envío del pedido.',
    example: 99.99,
  })
  @IsNumber()
  @Min(0)
  shipping_cost: number;

  @ApiProperty({
    description: 'El RFC para la factura.',
    example: 'XAXX010101000',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(13)
  rfc?: string;

  @ApiProperty({
    description: 'La Razón Social para la factura.',
    example: 'Mi Empresa S.A. de C.V.',
    required: false,
  })
  @IsString()
  @IsOptional()
  social_reason?: string;

  @ApiProperty({
    description: 'El Régimen Fiscal para la factura.',
    example: '601 - General de Ley Personas Morales',
    required: false,
  })
  @IsString()
  @IsOptional()
  fiscal_regime?: string;

  @ApiProperty({
    description: 'El código postal del domicilio fiscal.',
    example: '12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  postal_code?: string;
}
