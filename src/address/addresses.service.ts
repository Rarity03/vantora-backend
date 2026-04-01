import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { CreateAddressDto } from './dtos/create-address.dto';
import { CrudService } from '../common/global/crud.service';
import { User } from '../users/core/entities/user.entity';

@Injectable()
export class AddressesService extends CrudService<Address> {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(addressRepository);
  }

  async createForUser(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user_id: userId,
    });

    return this.addressRepository.save(address);
  }

  async findAllByUser(userId: string): Promise<Address[]> {
    return this.addressRepository.findBy({ user_id: userId });
  }

  async findOneByUser(userId: string, addressId: string): Promise<Address> {
    const address = await this.addressRepository.findOneBy({
      id: addressId,
      user_id: userId,
    });
    if (!address) {
      throw new NotFoundException(`Dirección con ID ${addressId} no encontrada para este usuario.`);
    }
    return address;
  }

  async updateForUser(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOneByUser(userId, addressId);

    if (address.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar esta dirección.');
    }

    this.addressRepository.merge(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async removeForUser(userId: string, addressId: string): Promise<void> {
    const address = await this.findOneByUser(userId, addressId);

    if (address.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta dirección.');
    }

    const result = await this.addressRepository.delete({ id: addressId, user_id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Dirección con ID ${addressId} no encontrada para este usuario.`,
      );
    }
  }
}