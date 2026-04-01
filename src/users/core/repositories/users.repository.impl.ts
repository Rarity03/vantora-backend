import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { UsersRepository } from './users.repository';
import { User } from '../entities/user.entity';
import { UserCredentials } from '../entities/user-credentials.entity';
import { CreateUserDto } from '../dtos/create-user-dto';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly userOrmRepo: Repository<User>,
        @InjectRepository(UserCredentials)
        private readonly credentialsOrmRepo: Repository<UserCredentials>,
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        const credentials = await this.credentialsOrmRepo.findOne({
            where: { email },
            relations: ['user'],
        });
        return credentials ? credentials.user : null;
    }

    async findCredentialsByEmail(
        email: string,
    ): Promise<UserCredentials | null> {
        return this.credentialsOrmRepo.findOne({
            where: { email },
            relations: ['user'],
        });
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        const user = await this.userOrmRepo.manager.transaction(
            async (transactionalEntityManager: EntityManager) => {
                const newUser = transactionalEntityManager.create(User, {
                    first_name: dto.first_name,
                    second_name: dto.second_name,
                    first_lastname: dto.first_lastname,
                    second_lastname: dto.second_lastname,
                    date_of_birth: dto.date_of_birth
                        ? new Date(dto.date_of_birth)
                        : undefined,
                });
                const savedUser =
                    await transactionalEntityManager.save(newUser);

                const newCredentials = transactionalEntityManager.create(
                    UserCredentials,
                    {
                        email: dto.email,
                        password_hash: dto.password,
                        user: savedUser,
                    }
                );
                await transactionalEntityManager.save(newCredentials);

                return savedUser;
            },
        );
        return this.userOrmRepo.findOneOrFail({
            where: { id: user.id },
            relations: ['credentials'],
        });
    }

    async findAllUsers(): Promise<User[]> {
        return this.userOrmRepo.find();
    }

    async findOne(id: string, relations: string[] = []): Promise<User | null> {
        return this.userOrmRepo.findOne({ 
            where: { id },
            relations,
        });
    }
}