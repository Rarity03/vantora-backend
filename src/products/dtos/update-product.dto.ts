import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, [
    'inventory_items',
    'category_ids',
    'tag_ids',
  ] as const),
) {}
