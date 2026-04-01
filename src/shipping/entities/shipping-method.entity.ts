import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('shippingmethods')
export class ShippingMethod extends BaseEntity {
  @ApiProperty({
    description: 'El identificador único del método de envío.',
    example: 'express',
  })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Nombre del método de envío.', example: 'Envío Express' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Descripción del método de envío.', example: '2-3 días laborables' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Precio del método de envío.',
    example: 149.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}