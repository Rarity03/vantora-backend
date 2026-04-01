import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from './entities/card.entity';
import { User } from '../users/core/entities/user.entity';
import { Address } from '../address/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User, Address])],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService, TypeOrmModule],
})
export class CardsModule {}