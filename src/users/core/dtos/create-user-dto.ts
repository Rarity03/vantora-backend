import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Primer nombre del usuario', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del usuario (opcional)',
    example: 'Carlos',
  })
  @IsString()
  @IsOptional() 
  second_name?: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty()
  first_lastname: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del usuario (opcional)',
    example: 'López',
  })
  @IsString()
  @IsOptional() 
  second_lastname?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD (opcional)',
    example: '1990-05-15',
  })
  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
