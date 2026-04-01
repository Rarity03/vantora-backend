import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async findAllByProduct(productId: string): Promise<Inventory[]> {
    return this.inventoryRepository.findBy({ product_id: productId });
  }

  async update(
    productId: string,
    inventoryId: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventoryItem = await this.inventoryRepository.findOneBy({
      id: inventoryId,
      product_id: productId,
    });

    if (!inventoryItem) {
      throw new NotFoundException(
        `La variante de inventario con ID ${inventoryId} no fue encontrada para el producto ${productId}.`,
      );
    }

    const updatedItem = this.inventoryRepository.merge(
      inventoryItem,
      updateInventoryDto,
    );
    return this.inventoryRepository.save(updatedItem);
  }
}