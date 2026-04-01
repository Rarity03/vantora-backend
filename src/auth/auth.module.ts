import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import config from '../config';
import { AccessToken } from './entities/access-token.entity';
import { JwtStrategy } from '../common/guards/jwt.strategy';
import { UsersModule } from '../users/core/users.module';
import { UserCredentials } from '../users/core/entities/user-credentials.entity';
@Module({
    imports: [
        UsersModule, 
        TypeOrmModule.forFeature([UserCredentials, AccessToken]), 
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [config.KEY],
            useFactory: (configService: ConfigType<typeof config>) => ({
                secret: configService.jwt.secret,
                signOptions: { 
                    expiresIn: configService.jwt.expiresIn as any 
                },
            }),
        }),
    ],
    providers: [AuthService, AuthRepository, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
