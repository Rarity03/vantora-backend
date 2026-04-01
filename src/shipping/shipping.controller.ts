import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { ShippingMethod } from './entities/shipping-method.entity';
import { IsPublic } from '../common/decorators/is-public.decorator';

@ApiTags('Shipping Methods')
@Controller('shipping-methods')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @IsPublic()
  @Get()
  @ApiOkResponse({
    description: 'Lista de métodos de envío disponibles.',
    type: [ShippingMethod],
  })
  findAll(): Promise<ShippingMethod[]> {
    return this.shippingService.findAll();
  }
}