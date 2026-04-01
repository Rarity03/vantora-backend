import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { ShoppingCart } from './shopping-cart.entity';
import { Inventory } from '../../products/inventory/entities/inventory.entity';

@Entity('shoppingcart_products')
export class ShoppingCartProduct {
  @PrimaryColumn({ type: 'uuid' })
  shopping_cart_id: string;

  @PrimaryColumn({ type: 'uuid' })
  inventory_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => ShoppingCart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopping_cart_id' })
  shopping_cart: ShoppingCart;

  @ManyToOne(() => Inventory, (item) => item.shopping_cart_products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory_item: Inventory;
}
