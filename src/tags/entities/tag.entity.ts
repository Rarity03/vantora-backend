import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TagsTypes } from "../enums/tags-types.enum";
import { BaseEntity } from "../../common/entities/base.entity";
import { ProductTags } from "../../products/entities/product-tags.entity";

@Entity('tags')
export class Tag extends BaseEntity {
    @ApiProperty({
        description: 'El UUID único que identifica a la categoría.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })
    @PrimaryGeneratedColumn('uuid', { name: 'tag_id' })
    id: string;

    @ApiProperty({
        description: 'Nombre unico de uno de los tipos',
        example: 'Informal'
    })
    @Column({ type: 'varchar', length: 100, unique: true})
    name: string;

    @ApiProperty({
        description: 'Tipo de tag',
        example: 'STYLE',
        enum: TagsTypes,
    })
    @Column({ type: 'varchar', length: 50 })
    type: TagsTypes

    @OneToMany(
        () => ProductTags,
        (productTags) => productTags.tag,
    )
    product_links: ProductTags[];
}
