import { Controller, Get, Param, ParseUUIDPipe, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ApiCrud } from '../common/decorators/api-crud.decorator';

const InvoiceCrud = ApiCrud({
  entity: Invoice,
  entityName: 'factura',
  entityNamePlural: 'facturas',
});

@ApiTags('User Invoices')
@ApiBearerAuth('access-token')
@Controller('users/me/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @InvoiceCrud.ApiFindAll()
  @Get()
  findAll(
    @Req() req: any,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<Invoice[]> {
    const userId = req.user.id;
    return this.invoicesService.findAllByUser(userId, paginationDto);
  }

  @InvoiceCrud.ApiFindOne({
    summary: 'Obtener una factura específica del usuario',
    paramName: 'invoiceId',
  })
  @Get(':invoiceId')
  findOne(
    @Req() req: any,
    @Param('invoiceId', ParseUUIDPipe) invoiceId: string,
  ): Promise<Invoice> {
    const userId = req.user.id;
    return this.invoicesService.findOneForUser(userId, invoiceId);
  }
}