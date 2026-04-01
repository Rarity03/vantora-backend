import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from '../entities/access-token.entity';
import { UserCredentials } from '../../users/core/entities/user-credentials.entity';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(UserCredentials)
        private readonly userCredentialRepository: Repository<UserCredentials>,
        @InjectRepository(AccessToken)
        private readonly accessTokenRepository: Repository<AccessToken>,
    ) {}

    async userExists(email: string): Promise<boolean> {
        const userCount = await this.userCredentialRepository.count({
            where: { email },
        });
        return userCount > 0;
    }

    async saveToken(userId: string, token: string): Promise<AccessToken> {
        const accessToken = this.accessTokenRepository.create({
            user_id: userId,
            token: token,
        });
        return this.accessTokenRepository.save(accessToken);
    }

    async findToken(token: string): Promise<AccessToken | null> {
        return this.accessTokenRepository.findOne({
            where: { token },
            relations: ['user'],
        });
    }

    async revokeToken(token: string): Promise<void> {
        const accessToken = await this.accessTokenRepository.findOneBy({ token });
        if (accessToken) {
            accessToken.was_revoked = true;
            await this.accessTokenRepository.save(accessToken);
        }
    }
}

