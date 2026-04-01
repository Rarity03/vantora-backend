import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { AddressesController } from './addresses.controller';
import { User } from '../users/core/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService,TypeOrmModule],
})
export class AddressesModule {}
