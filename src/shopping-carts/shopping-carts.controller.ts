import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ShoppingCartsService } from './shopping-carts.service';
import { AddItemDto } from './dtos/add-item.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';

@ApiTags('Shopping Carts')
@ApiBearerAuth('access-token')
@Controller('users/me/cart')
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el carrito del usuario' })
  @ApiOkResponse({
    description: 'Carrito del usuario obtenido exitosamente.',
    type: ShoppingCart,
  })
  getCart(@Req() req: any): Promise<ShoppingCart> {
    const userId = req.user.id;
    return this.shoppingCartsService.getCart(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK) 
  @ApiOperation({ summary: 'Añadir un producto al carrito' })
  @ApiBody({ type: AddItemDto })
  @ApiOkResponse({
    description: 'Producto añadido/actualizado en el carrito.',
    type: ShoppingCart,
  })
  @ApiBadRequestResponse({ description: 'Stock insuficiente o datos inválidos.' })
  addItem(
    @Req() req: any,
    @Body() addItemDto: AddItemDto,
  ): Promise<ShoppingCart> {
    const userId = req.user.id;
    return this.shoppingCartsService.addItemToCart(userId, addItemDto);
  }
  @Patch('items/:inventoryId')
  @ApiOperation({ summary: 'Actualizar la cantidad de un producto' })
  @ApiParam({ name: 'inventoryId', description: 'El UUID de la variante de inventario' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiOkResponse({
    description: 'Cantidad del producto actualizada.',
    type: ShoppingCart,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado en el carrito.' })
  @ApiBadRequestResponse({ description: 'Stock insuficiente.' })
  updateItemQuantity(
    @Req() req: any,
    @Param('inventoryId', ParseUUIDPipe) inventoryId: string,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<ShoppingCart> {
    const userId = req.user.id;
    return this.shoppingCartsService.updateItemQuantity(
      userId,
      inventoryId,
      updateDto.quantity,
    );
  }
  @Delete('items/:inventoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto del carrito' })
  @ApiParam({ name: 'inventoryId', description: 'El UUID de la variante de inventario' })
  @ApiNoContentResponse({ description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado en el carrito.' })
  async removeItem(
    @Req() req: any,
    @Param('inventoryId', ParseUUIDPipe) inventoryId: string,
  ): Promise<void> {
    const userId = req.user.id;
    await this.shoppingCartsService.removeItemFromCart(userId, inventoryId);
  }
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vaciar todos los productos del carrito' })
  @ApiNoContentResponse({ description: 'El carrito ha sido vaciado.' })
  async clearCart(@Req() req: any): Promise<void> {
    const userId = req.user.id;
    await this.shoppingCartsService.clearCart(userId);
  }
}
