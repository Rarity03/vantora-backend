import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartProduct } from './entities/shopping-cart-product.entity';
import { User } from '../users/core/entities/user.entity';
import { AddItemDto } from './dtos/add-item.dto';
import { Inventory } from 'src/products/inventory/entities/inventory.entity';

@Injectable()
export class ShoppingCartsService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async getCart(userId: string): Promise<ShoppingCart> { 
    return this.ensureCartExists(userId);
  }

  async addItemToCart(
    userId: string,
    { inventory_id, quantity }: AddItemDto,
  ): Promise<ShoppingCart> {
    return this.withTransaction(userId, async (manager, cart) => {
      const inventory = await this.getInventoryOrFail(manager, inventory_id);

      const cartProduct = await manager.findOne(ShoppingCartProduct, {
        where: { shopping_cart_id: cart.id, inventory_id },
      });

      const newQuantity = (cartProduct?.quantity ?? 0) + quantity;

      this.ensureStock(inventory.stock, newQuantity);

      const item = cartProduct
        ? Object.assign(cartProduct, { quantity: newQuantity })
        : manager.create(ShoppingCartProduct, {
            shopping_cart_id: cart.id,
            inventory_id,
            quantity,
          });

      await manager.save(item);
    });
  }

  async updateItemQuantity(
    userId: string,
    inventoryId: string,
    quantity: number,
  ): Promise<ShoppingCart> {
    return this.withTransaction(userId, async (manager, cart) => {
      const cartProduct = await this.getCartProductOrFail(
        manager,
        cart.id,
        inventoryId,
      );

      if (quantity <= 0) {
        await manager.remove(cartProduct);
        return;
      }

      const inventory = await this.getInventoryOrFail(manager, inventoryId);

      this.ensureStock(inventory.stock, quantity);

      cartProduct.quantity = quantity;

      await manager.save(cartProduct);
    });
  }

  async removeItemFromCart(userId: string, inventoryId: string): Promise<void> {
    const cart = await this.shoppingCartRepository.findOneBy({ user_id: userId });
    if (!cart) return;
    const result = await this.dataSource
      .getRepository(ShoppingCartProduct)
      .delete({ shopping_cart_id: cart.id, inventory_id: inventoryId });
    if (result.affected === 0) {
      throw new NotFoundException('Producto no encontrado en el carrito.');
    }
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.shoppingCartRepository.findOneBy({ user_id: userId });
    if (cart) {
      await this.dataSource
        .getRepository(ShoppingCartProduct)
        .delete({ shopping_cart_id: cart.id });
    }
  }

  private async withTransaction(
    userId: string,
    operation: (manager: EntityManager, cart: ShoppingCart) => Promise<void>,
  ): Promise<ShoppingCart> {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.ensureCartExists(userId, manager);
      await operation(manager, cart);
      return manager.findOneOrFail(ShoppingCart, {
        where: { id: cart.id },
        relations: this.getCartRelations(),
      });
    });
  }

  private async ensureCartExists(
    userId: string,
    manager?: EntityManager,
  ): Promise<ShoppingCart> {
    let cart: ShoppingCart | null;
    if (manager) {
      cart = await manager.findOne(ShoppingCart, { where: { user_id: userId } });
    } else {
      cart = await this.shoppingCartRepository.findOne({
        where: { user_id: userId },
        relations: this.getCartRelations(),
      });
    }

    if (!cart) {
      const user = await (manager ?? this.userRepository).findOneBy(User, { id: userId });

      if (!user) throw new NotFoundException(`Usuario ${userId} no encontrado.`);
      const newCartData = { user_id: user.id, status: 'active' as const };
      cart = manager ? manager.create(ShoppingCart, newCartData) : this.shoppingCartRepository.create(newCartData);
      await (manager ? manager.save(cart) : this.shoppingCartRepository.save(cart));

      if (!manager) {
        cart = await this.shoppingCartRepository.findOneOrFail({
          where: { id: cart.id },
          relations: this.getCartRelations(),
        });
      }
    }

    return cart;
  }

  private getInventoryOrFail(manager: EntityManager, id: string) {
    return manager.findOneByOrFail(Inventory, { id }).catch(() => { 
      throw new NotFoundException('Variante de producto no encontrada.');
    });
  }

  private async getCartProductOrFail(
    manager: EntityManager,
    cartId: string,
    inventoryId: string,
  ) {
    const item = await manager.findOne(ShoppingCartProduct, {
      where: { shopping_cart_id: cartId, inventory_id: inventoryId },
    });

    if (!item) {
      throw new NotFoundException('Producto no encontrado en el carrito.');
    }

    return item;
  }

  private ensureStock(stock: number, requested: number) {
    if (stock < requested) {
      throw new BadRequestException(`Stock insuficiente. Disponible: ${stock}`);
    }
  }

  private getCartRelations(): string[] {
    return [
      'user',
      'items',
      'items.inventory_item',
      'items.inventory_item.product',
    ];
  }
}