import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { TagsTypes } from "../enums/tags-types.enum";

export class CreateTagDto {
    @ApiProperty({
        description: 'Nombre unico de uno de los tipos',
        example: 'Informal'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: 'Tipo de tag',
        example: 'STYLE',
        enum: TagsTypes,
    })
    @IsEnum(TagsTypes)
    @IsNotEmpty()
    type: TagsTypes;
}