import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, FindManyOptions, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVector } from './entities/product-vector.entity';
import { ProductCategories } from './entities/product-categories.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { Category } from '../categories/entities/category.entity';
import { ProductTags } from './entities/product-tags.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { CrudService } from '../common/global/crud.service';
import { Tag } from '../tags/entities/tag.entity';
@Injectable()
export class ProductsService extends CrudService<Product> {
  constructor(
    @InjectRepository(Product)
    productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {
    super(productRepository);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.dataSource.transaction(async (manager) => {
      const categories = await manager.findBy(Category, {
        id: In(createProductDto.category_ids),
      });
      if (categories.length !== createProductDto.category_ids.length) {
        throw new BadRequestException('Una o más categorías no son válidas');
      }

      const tags = await manager.findBy(Tag, {
        id: In(createProductDto.tag_ids),
      });
      if (tags.length !== createProductDto.tag_ids.length) {
        throw new BadRequestException('Uno o más tags/estilos no son válidos');
      }

      const newProduct = manager.create(Product, {
        ...createProductDto,
      });
      const savedProduct = await manager.save(newProduct);

      const inventoryItems = createProductDto.inventory_items.map((item) =>
        manager.create(Inventory, {
          product_id: savedProduct.id,
          ...item,
        })
      );
      await manager.save(inventoryItems);

      if (createProductDto.additional_vectors?.length) {
        const productVectors = createProductDto.additional_vectors.map(
          (vector) =>
            manager.create(ProductVector, {
              ...vector,
              product_id: savedProduct.id,
              product: savedProduct,
            }),
        );
        await manager.save(productVectors);
      }

      const productCategories = createProductDto.category_ids.map((catId) =>
        manager.create(ProductCategories, {
          product_id: savedProduct.id,
          category_id: catId,
        }),
      );
      await manager.save(productCategories);

      const productTags = createProductDto.tag_ids.map((tagId) =>
        manager.create(ProductTags, {
          product_id: savedProduct.id,
          tag_id: tagId,
        }),
      );
      await manager.save(productTags);

      const createdProduct = await manager.findOneBy(Product, { id: savedProduct.id });
      if (!createdProduct) {
        throw new NotFoundException(`Producto con ID ${savedProduct.id} no encontrado después de la creación`);
      }
      return createdProduct;
    });
  }

  async findAll(paginationDto?: PaginationQueryDto): Promise<Product[]> {
    const { limit = 10, offset = 0, category } = paginationDto || {};

    const findOptions: FindManyOptions<Product> = {
      relations: [
        'inventory_items',
        'vector',
        'category_links.category',
        'tag_links.tag',
      ],
      take: limit,
      skip: offset,
      where: {},
    };

    if (category && category !== 'Todo') {
      findOptions.where = { tipo: Like(`%${category}%`) };
    }

    return this.repository.find(findOptions);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repository.findOne({
      where: { id },
      relations: [
        'inventory_items',
        'vector',
        'category_links.category',
        'tag_links.tag',
      ],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

}
