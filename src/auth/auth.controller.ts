import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService, AuthResponse, UserProfile } from './auth.service';
import { CreateUserDto } from 'src/users/core/dtos/create-user-dto';
import { LoginDto } from './dtos/login.dto';
import { IsPublic } from '../common/decorators/is-public.decorator';
import { User } from '../users/core/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado y autenticado exitosamente.',
        schema: {
            example: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                user: { id: '...', firstName: 'Juan', email: 'juan@perez.com' },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    @ApiResponse({
        status: 409,
        description: 'El correo electrónico ya está en uso.',
    })
    register(@Body() registerRequest: CreateUserDto): Promise<AuthResponse> {
        return this.authService.registerUser(registerRequest);
    }

    @IsPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión de un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Usuario autenticado exitosamente.',
        schema: {
          example: {
            code: 200,
            status: 'OK',
            message: 'Success',
            timestamp: '2025-11-17T02:35:57.000Z',
            data: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', user: { id: '...', firstName: 'Juan', email: 'juan@perez.com' } }
          }
        },
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Cerrar sesión y revocar el token actual' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async logout(@Req() req: any): Promise<{ message: string }> {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            await this.authService.logout(token);
        }
        return { message: 'Has cerrado sesión exitosamente.' };
    }

    @Get('profile')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
    @ApiResponse({
        status: 200,
        description: 'Perfil del usuario obtenido exitosamente.',
        type: User,
    })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    getProfile(@Req() req: any): Promise<UserProfile> {
        return this.authService.getProfile(req.user.sub);
    }
}
