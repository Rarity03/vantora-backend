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
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { ApiCrud } from '../../common/decorators/api-crud.decorator';
import { IsPublic } from '../../common/decorators/is-public.decorator';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';

const CommentCrud = ApiCrud({
  entity: Comment,
  entityName: 'comentario',
  entityNamePlural: 'comentarios',
  createDto: CreateCommentDto,
  updateDto: UpdateCommentDto,
});

@ApiTags('Product Comments')
@Controller('products/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth('access-token')
  @CommentCrud.ApiCreate()
  @Post()
  create(
    @Req() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.id; 
    return this.commentsService.createForUserAndProduct(
      userId,
      productId,
      createCommentDto,
    );
  }

  @IsPublic()
  @CommentCrud.ApiFindAll()
  @Get()
  findAll(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() paginationDto: PaginationQueryDto,
  ) {
    return this.commentsService.findAllByProduct(productId, paginationDto);
  }

  @ApiBearerAuth('access-token')
  @CommentCrud.ApiUpdate({
    paramName: 'commentId',
  })
  @Put(':commentId')
  update(
    @Req() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = req.user.id;
    return this.commentsService.updateForUser(
      productId,
      userId,
      commentId,
      updateCommentDto,
    );
  }

  @ApiBearerAuth('access-token')
  @CommentCrud.ApiRemove({
    paramName: 'commentId',
  })
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    const userId = req.user.id;
    return this.commentsService.removeForUser(productId, userId, commentId);
  }
}