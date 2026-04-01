import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from './entities/user-credentials.entity';
import { Repository, UpdateResult } from 'typeorm';
import type { ConfigType } from '@nestjs/config';
import { UpdateUserDto } from './dtos/update-user-dto';
import { CrudService } from '../../common/global/crud.service';
import config from '../../config';
import { UserProfile } from '../../auth/auth.service';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    private readonly usersRepository: UsersRepository,
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
  ) {
    super(userRepository);
  }

  async createUser(newUser: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(newUser);
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    return this.usersRepository.findCredentialsByEmail(email);
  }

  async findOne(id: string, relations: string[] = []): Promise<User> {
    const user = await this.usersRepository.findOne(id, relations);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const result: UpdateResult = await this.repository.update(id, updateUserDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return this.findOne(id, ['credentials']);
  }

  async getProfileWithEmail(id: string): Promise<UserProfile> {
    const userWithCredentials = await this.findOne(id, ['credentials']);
    const { credentials, ...user } = userWithCredentials;
    return { ...user, email: credentials.email };
  }

}
