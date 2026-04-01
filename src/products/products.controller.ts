import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationQueryDto } from '../common/dtos/pagination-query.dto';
import { ApiCrud } from '../common/decorators/api-crud.decorator';
import { IsPublic } from '../common/decorators/is-public.decorator';

const ProductCrud = ApiCrud({
  entity: Product,
  entityName: 'producto',
  entityNamePlural: 'productos',
  createDto: CreateProductDto,
  updateDto: UpdateProductDto,
});

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ProductCrud.ApiCreate()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ProductCrud.ApiFindAll()
  @IsPublic()
  @Get()
  findAll(@Query() paginationDto: PaginationQueryDto) {
    return this.productsService.findAll(paginationDto);
  }

  @ProductCrud.ApiFindOne()
  @IsPublic()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @ProductCrud.ApiUpdate()
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @ProductCrud.ApiRemove()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
