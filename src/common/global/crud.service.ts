import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';

@Injectable()
export abstract class CrudService<T extends { id: string }> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity as DeepPartial<T>);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<T> {
    const where = { id } as FindOptionsWhere<T>;
    const entity = await this.repository.findOneBy(where);
    if (!entity) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    }
    return entity;
  }

  async update(id: string, updateDto: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.repository.save(entity as DeepPartial<T>);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    }
  }
}