import {
  Controller,
  Param,
  Body,
  ParseUUIDPipe,
  Patch,
  Get,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@ApiTags('Products Inventory')
@ApiBearerAuth('access-token')
@Controller('products/:productId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las variantes de inventario de un producto',
  })
  @ApiOkResponse({
    description: 'Lista de variantes de inventario obtenida exitosamente.',
    type: [Inventory],
  })
  findAll(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.inventoryService.findAllByProduct(productId);
  }

  @Patch(':inventoryId')
  @ApiOperation({
    summary: 'Actualizar una variante de inventario específica de un producto',
  })
  update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('inventoryId', ParseUUIDPipe) inventoryId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(
      productId,
      inventoryId,
      updateInventoryDto,
    );
  }

 
}