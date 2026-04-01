import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({
    description: 'La fecha y hora en que el registro fue creado.',
    example: '2025-11-16T17:24:49.954Z',
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @ApiProperty({
    description: 'La fecha y hora de la última actualización del registro.',
    example: '2025-11-16T17:27:58.774Z',
  })
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;
}