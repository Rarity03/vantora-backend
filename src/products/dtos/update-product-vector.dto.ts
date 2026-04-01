import { PartialType } from '@nestjs/swagger';
import { CreateProductVectorDto } from './create-product-vector.dto';

export class UpdateProductVectorDto extends PartialType(
  CreateProductVectorDto,
) {}
