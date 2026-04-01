// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserCredentials } from './entities/user-credentials.entity';
import { Product } from '../../products/entities/product.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { UsersService } from './users.service';
import { Comment } from '../comments/entities/comment.entity'; 
import { CommentsController } from '../comments/comments.controller';
import { CommentsService } from '../comments/comments.service';
import { FavoritesController } from '../favorites/favorites.controller';
import { FavoritesService } from '../favorites/favorites.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersRepositoryImpl } from './repositories/users.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([
    User, 
    UserCredentials,
    Favorite, 
    Comment, 
    Product
  ])],
  controllers: [UsersController, CommentsController, FavoritesController],
  providers: [
    UsersService,
    CommentsService,
    FavoritesService,
    {
      provide: UsersRepository,
      useClass: UsersRepositoryImpl,
    },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
