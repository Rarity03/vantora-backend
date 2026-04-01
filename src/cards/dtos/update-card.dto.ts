import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCardDto extends PartialType(OmitType(CreateCardDto, ['card_token', 'last_four_digits'])) {
    @ApiPropertyOptional({ description: 'Establecer como tarjeta predeterminada.' })
    @IsBoolean()
    @IsOptional()
    is_default?: boolean;
}
