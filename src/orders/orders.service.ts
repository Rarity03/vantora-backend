import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { ShoppingCart } from '../shopping-carts/entities/shopping-cart.entity';
import { ShoppingCartProduct } from '../shopping-carts/entities/shopping-cart-product.entity';
import { Address } from '../address/entities/address.entity';
import { Card } from '../cards/entities/card.entity';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { Inventory } from '../products/inventory/entities/inventory.entity';
@Injectable()
export class OrdersService {
  private readonly orderRelations = [
    'items',
    'invoice',
    'shipping_address',
    'user',
  ];
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const cart = await this.getCartOrFail(manager, userId);

      const address = await this.getEntityForUser(
        manager,
        Address,
        dto.shipping_address_id,
        userId,
        'La dirección no pertenece al usuario.',
      );

      const card = await this.getEntityForUser(
        manager,
        Card,
        dto.card_id,
        userId,
        'La tarjeta no pertenece al usuario.',
      );

      const { totalPrice: itemsPrice, inventoryToUpdate } =
        await this.processCartItems(cart.items);

      const order = await this.createOrderRecord(manager, {
        userId,
        addressId: address.id,
        cardId: card.id,
        totalPrice: itemsPrice + dto.shipping_cost,
        shippingCost: dto.shipping_cost,
      });

      await this.createOrderItems(manager, order.id, cart.items);
      await this.updateInventoryStock(manager, inventoryToUpdate);

      if (dto.rfc && dto.social_reason) {
        await this.createInvoiceRecord(manager, order, dto, itemsPrice);
      }
      await this.clearShoppingCart(manager, cart.id);

      return this.getFinalOrder(manager, order.id);
    });
  }

  async findOneForUser(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: this.orderRelations,
    });

    if (!order) {
      throw new NotFoundException(
        `Pedido con ID ${orderId} no encontrado para este usuario.`,
      );
    }

    return order;
  }

  async findOne(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: this.orderRelations,
    });

    if (!order) {
      throw new NotFoundException(
        `Pedido con ID ${orderId} no encontrado.`,
      );
    }

    return order;
  }

  async findAllByUser(
    userId: string,
    paginationDto: PaginationQueryDto,
  ): Promise<Order[]> {
    const { limit = 10, offset = 0, search } = paginationDto;
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    this.orderRelations.forEach(relation => {
      queryBuilder.leftJoinAndSelect(`order.${relation}`, relation);
    });

    queryBuilder.where('order.user_id = :userId', { userId });

    if (search) {
      queryBuilder.andWhere(
        '(CAST(order.order_id AS TEXT) ILIKE :search OR order.status ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder
      .orderBy('order.order_date', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findOne(orderId);
    order.status = updateOrderDto.status;
    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId);
    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new BadRequestException(`No se puede cancelar un pedido que ya fue '${order.status}'.`);
    }
    return this.updateOrderStatus(orderId, { status: 'cancelled' });
  }

  async remove(orderId: string): Promise<void> {
    const result = await this.orderRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Pedido con ID ${orderId} no encontrado para eliminar.`,
      );
    }
  }

  private async getEntityForUser<T extends ObjectLiteral>(
    manager: EntityManager,
    entity: EntityTarget<T>,
    id: string,
    userId: string,
    errorMessage: string,
  ): Promise<T> {
    const found = await manager.findOneBy<T>(entity, { id, user_id: userId } as any);
    if (!found) throw new NotFoundException(errorMessage);
    return found;
  }

  private async getCartOrFail(
    manager: EntityManager,
    userId: string,
  ): Promise<ShoppingCart> {
    const cart = await manager.findOne(ShoppingCart, {
      where: { user_id: userId },
      relations: ['items', 'items.inventory_item'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('El carrito de compras está vacío.');
    }

    return cart;
  }

  private validateCartStock(cartItems: ShoppingCartProduct[]): void {
    for (const item of cartItems) {
      if (!item.inventory_item) {
        throw new NotFoundException(
          `Inventario ${item.inventory_id} no encontrado.`,
        );
      }

      if (item.inventory_item.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para el producto (ID: ${item.inventory_id}).`,
        );
      }
    }
  }

  private calculateTotals(cartItems: ShoppingCartProduct[]): number {
    return cartItems.reduce(
      (total, ci) =>
        total + Number(ci.inventory_item.price) * ci.quantity,
      0,
    );
  }

  private async processCartItems(cartItems: ShoppingCartProduct[]) {
    this.validateCartStock(cartItems);

    const totalPrice = this.calculateTotals(cartItems);

    const inventoryToUpdate = cartItems.map((ci) => ({
      item: ci.inventory_item,
      quantityToReduce: ci.quantity,
    }));

    return { totalPrice, inventoryToUpdate };
  }

  private async createOrderRecord(
    manager: EntityManager,
    {
      userId,
      addressId,
      cardId,
      totalPrice,
      shippingCost,
    }: {
      userId: string;
      addressId: string;
      cardId: string;
      totalPrice: number;
      shippingCost: number;
    },
  ): Promise<Order> {
    const order = manager.create(Order, {
      user_id: userId,
      address_id: addressId,
      card_id: cardId,
      status: 'processing',
      total_price: totalPrice,
      shipping_cost: shippingCost,
      order_date: new Date(),
    });

    return manager.save(order);
  }

  private async createOrderItems(
    manager: EntityManager,
    orderId: string,
    cartItems: ShoppingCartProduct[],
  ): Promise<void> {
    const orderItems = cartItems.map((item) =>
      manager.create(OrderItem, {
        order_id: orderId,
        inventory_id: item.inventory_item.id,
        quantity: item.quantity,
        price_at_purchase: Number(item.inventory_item.price),
      }),
    );

    await manager.save(orderItems);
  }

  private async updateInventoryStock(
    manager: EntityManager,
    inventoryUpdates: { item: Inventory; quantityToReduce: number }[],
  ): Promise<void> {
    for (const { item, quantityToReduce } of inventoryUpdates) {
      await manager.update(
        Inventory,
        { id: item.id },
        { stock: () => `stock - ${quantityToReduce}` },
      );
    }
  }

  private generateInvoiceNumber(orderId: string): string {
    return `FAC-${Date.now()}-${orderId.slice(0, 8)}`;
  }

  private async createInvoiceRecord(
    manager: EntityManager,
    order: Order,
    dto: CreateOrderDto,
    itemsPrice: number,
  ): Promise<void> {
    const IVA_RATE = 1.16;
    const productsSubtotal = itemsPrice / IVA_RATE;
    const productsTax = itemsPrice - productsSubtotal;

    const shippingSubtotal = order.shipping_cost / IVA_RATE;
    const shippingTax = order.shipping_cost - shippingSubtotal;

    const invoice = manager.create(Invoice, {
      order_id: order.id,
      invoice_number: this.generateInvoiceNumber(order.id),
      subtotal: productsSubtotal + shippingSubtotal,
      tax_amount: productsTax + shippingTax,
      total_amount: order.total_price,
      status: 'paid',
      rfc: dto.rfc,
      social_reason: dto.social_reason,
      fiscal_regime: dto.fiscal_regime,
      postal_code: dto.postal_code,
    });

    await manager.save(invoice);
  }

  private async clearShoppingCart(
    manager: EntityManager,
    cartId: string,
  ): Promise<void> {
    await manager.delete(ShoppingCartProduct, {
      shopping_cart_id: cartId,
    });
  }

  private async getFinalOrder(
    manager: EntityManager,
    orderId: string,
  ): Promise<Order> {
    return manager.findOneOrFail(Order, {
      where: { id: orderId },
      relations: this.orderRelations,
    });
  }
}
