import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { AuthRepository } from '../../auth/repositories/auth.repository';
import config from '../../config';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    @Inject(config.KEY) configService: ConfigType<typeof config>, 
  ) {
    const secret = configService.jwt.secret;
    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true, 
    });
  }

  async validate(req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
    if (!token) {
      throw new UnauthorizedException('No se encontró el token.');
    }
    const accessToken = await this.authRepository.findToken(token);
    if (!accessToken || accessToken.was_revoked || accessToken.is_expired) {
      throw new UnauthorizedException('La sesión es inválida o ha expirado.');
    }
    return accessToken.user;
  }
}
