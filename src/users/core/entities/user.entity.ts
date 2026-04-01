import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../../orders/entities/order.entity';
import { ShoppingCart } from '../../../shopping-carts/entities/shopping-cart.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { UserCredentials } from './user-credentials.entity';
import { Address } from '../../../address/entities/address.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Card } from '../../../cards/entities/card.entity';

@Entity('users')
export class User extends BaseEntity {
    @ApiProperty({
        description: 'El UUID único que identifica al usuario.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })
    @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
    id: string;
    
    @ApiProperty({ description: 'Primer nombre del usuario.', example: 'Juan' })
    @Column({ type: 'varchar', length: 100 })
    first_name: string;

    @ApiPropertyOptional({
        description: 'Segundo nombre del usuario.',
        example: 'Carlos',
    })
    @Column({ type: 'varchar', length: 100, nullable: true })
    second_name: string;

    @ApiProperty({ description: 'Primer apellido del usuario.', example: 'Pérez' })
    @Column({ type: 'varchar', length: 100 })
    first_lastname: string;

    @ApiPropertyOptional({
        description: 'Segundo apellido del usuario.',
        example: 'López',
    })
    @Column({ type: 'varchar', length: 100, nullable: true })
    second_lastname: string;

    @ApiPropertyOptional({
        description: 'Fecha de nacimiento del usuario.',
        example: '1990-05-15',
    })
    @Column({ type: 'date', nullable: true })
    date_of_birth: Date;

    @ApiProperty({
        description: 'Indica si el usuario está activo.',
        example: true,
    })
    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ApiPropertyOptional({
        description: 'URL de la imagen de perfil del usuario.',
        example: 'https://example.com/path/to/avatar.jpg',
    })
    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar_url: string;

    @OneToOne(() => UserCredentials, (credentials) => credentials.user)
    credentials: UserCredentials;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites: Favorite[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToOne(() => ShoppingCart, (cart) => cart.user)
    shopping_cart: ShoppingCart;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Card, (card) => card.user) 
    cards: Card[];
}
