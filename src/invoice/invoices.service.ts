import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async findAllByUser(
    userId: string,
    paginationDto: PaginationQueryDto,
  ): Promise<Invoice[]> {
    const { limit = 10, offset = 0, search } = paginationDto;
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('invoice.order', 'order')
      .where('order.user_id = :userId', { userId });

    if (search) {
      queryBuilder.andWhere(
        '(invoice.invoice_number ILIKE :search OR invoice.rfc ILIKE :search OR invoice.social_reason ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder.orderBy('invoice.created_at', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async findOneForUser(userId: string, invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('invoice.order', 'order')
      .where('invoice.id = :invoiceId', { invoiceId })
      .andWhere('order.user_id = :userId', { userId })
      .getOne();

    if (!invoice) {
      throw new NotFoundException(
        `Factura con ID ${invoiceId} no encontrada para este usuario.`,
      );
    }
    return invoice;
  }
}