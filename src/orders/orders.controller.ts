import {
  Controller,
  Patch,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { ApiCrud } from '../common/decorators/api-crud.decorator';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';

const OrderCrud = ApiCrud({
  entity: Order,
  entityName: 'pedido',
  entityNamePlural: 'pedidos',
  createDto: CreateOrderDto,
  updateDto: UpdateOrderDto,
});

@ApiTags('User Orders')
@ApiBearerAuth('access-token')
@Controller('users/me/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @OrderCrud.ApiCreate()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Req() req: any, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const userId = req.user.id;
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @OrderCrud.ApiFindAll()
  @Get()
  findAll(
    @Req() req: any,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<Order[]> {
    const userId = req.user.id;
    return this.ordersService.findAllByUser(userId, paginationDto);
  }

  @OrderCrud.ApiFindOne({
    summary: 'Obtener un pedido específico del usuario',
    paramName: 'orderId',
  })
  @Get(':orderId')
  findOne(
    @Req() req: any,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<Order> {
    const userId = req.user.id;
    return this.ordersService.findOneForUser(userId, orderId);
  }
}

@ApiTags('Admin Orders')
@ApiBearerAuth('access-token')
@Controller('orders/manage')
export class OrdersManageController {
  constructor(private readonly ordersService: OrdersService) {}

  @OrderCrud.ApiUpdate({
    paramName: 'orderId',
    summary: 'Actualizar el estado de un pedido (Admin)',
  })
  @Patch(':orderId/status')
  updateStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrderStatus(orderId, updateOrderDto);
  }

  @ApiOperation({
    summary: 'Cancelar un pedido (Admin)',
    description: 'Cambia el estado de un pedido a "cancelled".',
  })
  @OrderCrud.ApiUpdate({
    paramName: 'orderId',
    summary: 'Cancelar un pedido (Admin)',
  })
  @Patch(':orderId/cancel')
  cancelOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<Order> {
    return this.ordersService.cancelOrder(orderId);
  }
}
