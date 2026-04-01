import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from '../core/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async add(userId: string, productId: string): Promise<Favorite> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado.`);
    }

    const existingFavorite = await this.favoriteRepository.findOneBy({ user_id: userId, product_id: productId });
    if (existingFavorite) {
      throw new ConflictException('Este producto ya está en tus favoritos.');
    }

    const favorite = this.favoriteRepository.create({ user_id: userId, product_id: productId });
    return this.favoriteRepository.save(favorite);
  }

  async remove(userId: string, productId: string): Promise<void> {
    const result = await this.favoriteRepository.delete({ user_id: userId, product_id: productId });
    if (result.affected === 0) {
      throw new NotFoundException('Este producto no se encontró en tus favoritos.');
    }
  }

  async findAllByUser(userId: string): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { user_id: userId },
      relations: [
        'product',
        'product.inventory_items',
      ],
    });
  }
}
