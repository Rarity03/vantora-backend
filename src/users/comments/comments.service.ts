import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CrudService } from '../../common/global/crud.service';
import { User } from '../core/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';

@Injectable()
export class CommentsService extends CrudService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(commentRepository);
  }

  async createForUserAndProduct(
    userId: string,
    productId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado.`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      user_id: userId,
      product_id: productId,
    });

    return this.commentRepository.save(comment);
  }

  async findAllByProduct(productId: string, paginationDto: PaginationQueryDto): Promise<Comment[]> {
    const { limit = 5, offset = 0 } = paginationDto;
    return this.commentRepository.find({
      where: { product_id: productId },
      relations: ['user'],
      order: { commented_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async updateForUser(
    productId: string,
    userId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id: commentId, product_id: productId });

    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${commentId} no encontrado.`);
    }

    if (comment.user_id !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este comentario.',
      );
    }

    const updatedComment = this.commentRepository.merge(comment, updateCommentDto);
    return this.commentRepository.save(updatedComment);
  }

  async removeForUser(productId: string, userId: string, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOneBy({ id: commentId, product_id: productId });

    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${commentId} no encontrado.`);
    }

    if (comment.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este comentario.');
    }

    await this.commentRepository.remove(comment);
  }
}