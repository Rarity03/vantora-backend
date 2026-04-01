import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/common/global/crud.service';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dtos/create-card.dto';
import { UpdateCardDto } from './dtos/update-card.dto';
import { User } from '../users/core/entities/user.entity';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class CardsService extends CrudService<Card> {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(cardRepository);
  }

  async createForUser(
    userId: string,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    const address = await this.addressRepository.findOneBy({ id: createCardDto.address_id });
    if (!address) {
      throw new NotFoundException(`Dirección con ID ${createCardDto.address_id} no encontrada.`);
    }

    if (address.user_id !== userId) {
        throw new ForbiddenException('La dirección de facturación no pertenece al usuario.');
    }

    const card = this.cardRepository.create({
      ...createCardDto,
      user_id: userId,
    });

    return this.cardRepository.save(card);
  }

  async findAllByUser(userId: string): Promise<Card[]> {
    return this.cardRepository.findBy({ user_id: userId });
  }

  async findOneByUser(userId: string, cardId: string): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id: cardId, user_id: userId });
    if (!card) {
      throw new NotFoundException(`Tarjeta con ID ${cardId} no encontrada para este usuario.`);
    }
    return card;
  }

  async updateForUser(
    userId: string,
    cardId: string,
    updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    const card = await this.findOneByUser(userId, cardId);

    if (updateCardDto.address_id && updateCardDto.address_id !== card.address_id) {
      const newAddress = await this.addressRepository.findOneBy({ id: updateCardDto.address_id });
      if (!newAddress) {
        throw new NotFoundException(`La nueva dirección con ID ${updateCardDto.address_id} no fue encontrada.`);
      }
      if (newAddress.user_id !== userId) {
        throw new ForbiddenException('La nueva dirección de facturación no pertenece a este usuario.');
      }
    }

    this.cardRepository.merge(card, updateCardDto);
    return this.cardRepository.save(card);
  }

  async removeForUser(userId: string, cardId: string): Promise<void> {
    await this.findOneByUser(userId, cardId);
    await this.cardRepository.delete(cardId);
  }

  async setDefaultCard(userId: string, cardId: string): Promise<Card> {
    const cardToSetAsDefault = await this.findOneByUser(userId, cardId);

    await this.cardRepository.update(
      { user_id: userId, is_default: true },
      { is_default: false },
    );

    cardToSetAsDefault.is_default = true;
    return this.cardRepository.save(cardToSetAsDefault);
  }
}