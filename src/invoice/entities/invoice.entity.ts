import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @ApiProperty({ description: 'El UUID único de la factura.' })
  @PrimaryGeneratedColumn('uuid', { name: 'invoice_id' })
  id: string;

  @Column({ type: 'uuid', unique: true })
  order_id: string;

  @ApiProperty({ description: 'Número de folio único de la factura.' })
  @Column({ type: 'varchar', length: 100, unique: true })
  invoice_number: string;

  @ApiProperty({ description: 'Subtotal antes de impuestos.' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ description: 'Monto de impuestos.' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax_amount: number;

  @ApiProperty({ description: 'Monto total de la factura.' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @ApiProperty({ description: 'Estado de la factura.', example: 'issued' })
  @Column({ type: 'varchar', length: 50, default: 'issued' })
  status: string;

  @ApiProperty({ description: 'URL del PDF de la factura.' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  pdf_url: string;

  @ApiProperty({ description: 'RFC del receptor.' })
  @Column({ type: 'varchar', length: 13, nullable: true })
  rfc: string;

  @ApiProperty({ description: 'Razón social del receptor.' })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'social_reason' })
  social_reason: string;

  @ApiProperty({ description: 'Régimen fiscal del receptor.' })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'fiscal_regime' })
  fiscal_regime: string;
  
  @ApiProperty({ description: 'Código postal del receptor.' })
  @Column({ type: 'varchar', length: 10, nullable: true, name: 'postal_code' })
  postal_code: string;

  @OneToOne(() => Order, (order) => order.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
