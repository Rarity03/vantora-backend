import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.repository';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { User } from '../users/core/entities/user.entity';
import { UsersService } from '../users/core/users.service';
import { CreateUserDto } from '../users/core/dtos/create-user-dto';

export interface AuthResponse {
    token: string;
    user: UserProfile;
}

export type UserProfile = Omit<User, 'credentials'> & { email: string };
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async registerUser(registerRequest: CreateUserDto): Promise<AuthResponse> {
        const userExists = await this.authRepository.userExists(
            registerRequest.email,
        );
        if (userExists) {
            throw new ConflictException('El usuario ya existe');
        }
        const hashedPassword = await this.hashPassword(
            registerRequest.password,
        );
        const userToCreate = { ...registerRequest, password: hashedPassword };

        const newUser = await this.usersService.createUser(userToCreate);

        const payload = { sub: newUser.id, email: newUser.credentials.email };
        const token = this.jwtService.sign(payload);

        await this.authRepository.saveToken(newUser.id, token);

        const { credentials, ...user } = newUser;
        const userProfile = { ...user, email: credentials.email };

        return { token, user: userProfile };
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const userCredentials = await this.usersService.findCredentialsByEmail(
            loginDto.email,
        );

        if (!userCredentials) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordMatching = await bcrypt.compare(
            loginDto.password,
            userCredentials.password_hash,
        );

        if (!isPasswordMatching) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: userCredentials.user.id, email: userCredentials.email };
        const token = this.jwtService.sign(payload);

        await this.authRepository.saveToken(userCredentials.user.id, token);

        const { credentials, ...user } = userCredentials.user;
        const userProfile = { ...user, email: userCredentials.email };

        return { token, user: userProfile };
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async logout(token: string): Promise<void> {
        await this.authRepository.revokeToken(token);
    }

    async getProfile(userId: string): Promise<UserProfile> {
        const user = await this.usersService.findOne(userId, ['credentials']);

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        const { credentials, ...userProfile } = user;

        const profileWithEmail = {
            ...userProfile,
            email: credentials.email,
        };

        return profileWithEmail;
    }
}
