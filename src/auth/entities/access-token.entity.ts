import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/core/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('access_tokens')
export class AccessToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'access_token_id' })
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'boolean', default: false })
  is_expired: boolean;

  @Column({ type: 'boolean', default: false })
  was_revoked: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
