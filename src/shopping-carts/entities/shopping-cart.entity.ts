import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/core/entities/user.entity';
import { ShoppingCartProduct } from './shopping-cart-product.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('shoppingcarts')
export class ShoppingCart extends BaseEntity{
  @PrimaryGeneratedColumn('uuid', { name: 'shopping_cart_id' })
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @OneToOne(() => User, (user) => user.shopping_cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @OneToMany(
    () => ShoppingCartProduct,
    (cartProduct) => cartProduct.shopping_cart,
  )
  items: ShoppingCartProduct[];
}
