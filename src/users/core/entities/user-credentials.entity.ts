import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_credentials')
export class UserCredentials {
    @PrimaryGeneratedColumn('uuid', { name: 'credential_id' })
    id: string;

    @Column({ type: 'uuid', unique: true })
    user_id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password_hash: string;

    @Column({ type: 'timestamptz', nullable: true })
    last_login: Date;

    @OneToOne(() => User, (user) => user.credentials, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
