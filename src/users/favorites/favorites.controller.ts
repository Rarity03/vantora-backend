import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dtos/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { ApiCrud } from '../../common/decorators/api-crud.decorator';

const FavoriteCrud = ApiCrud({
  entity: Favorite,
  entityName: 'favorito',
  entityNamePlural: 'favoritos',
  createDto: CreateFavoriteDto,
});

@ApiTags('User Favorites')
@ApiBearerAuth('access-token')
@Controller('users/me/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @FavoriteCrud.ApiCreate()
  @Post()
  add(
    @Req() req: any,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    const userId = req.user.id;
    return this.favoritesService.add(userId, createFavoriteDto.product_id);
  }

  @FavoriteCrud.ApiFindAll()
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.favoritesService.findAllByUser(userId);
  }

  @FavoriteCrud.ApiRemove({
    summary: 'Eliminar un producto de favoritos',
    paramName: 'productId',
  })
  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const userId = req.user.id;
    return this.favoritesService.remove(userId, productId);
  }
}