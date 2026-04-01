import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Patch,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { Card } from './entities/card.entity';
import { ApiCrud } from '../common/decorators/api-crud.decorator';

const CardCrud = ApiCrud({
  entity: Card,
  entityName: 'tarjeta',
  entityNamePlural: 'tarjetas',
  createDto: CreateCardDto,
  updateDto: UpdateCardDto,
});

@ApiTags('User Cards')
@ApiBearerAuth('access-token')
@Controller('users/me/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @CardCrud.ApiCreate()
  @Post()
  create(@Req() req: any, @Body() createCardDto: CreateCardDto) {
    const userId = req.user.id;
    return this.cardsService.createForUser(userId, createCardDto);
  }

  @CardCrud.ApiFindAll()
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.cardsService.findAllByUser(userId);
  }

  @CardCrud.ApiFindOne({
    paramName: 'cardId',
  })
  @Get(':cardId')
  findOne(
    @Req() req: any,
    @Param('cardId', ParseUUIDPipe) cardId: string,
  ) {
    const userId = req.user.id;
    return this.cardsService.findOneByUser(userId, cardId);
  }

  @CardCrud.ApiUpdate({
    paramName: 'cardId',
  })
  @Put(':cardId')
  update(
    @Req() req: any,
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const userId = req.user.id;
    return this.cardsService.updateForUser(userId, cardId, updateCardDto);
  }

  @CardCrud.ApiRemove({
    paramName: 'cardId',
  })
  @Delete(':cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('cardId', ParseUUIDPipe) cardId: string) {
    const userId = req.user.id;
    return this.cardsService.removeForUser(userId, cardId);
  }

  @ApiOperation({ summary: 'Establecer una tarjeta como predeterminada' })
  @ApiResponse({ status: 200, description: 'Tarjeta actualizada a predeterminada.', type: Card })
  @Patch(':cardId/set-default')
  setDefault(
    @Req() req: any,
    @Param('cardId', ParseUUIDPipe) cardId: string,
  ) {
    const userId = req.user.id;
    return this.cardsService.setDefaultCard(userId, cardId);
  }
}