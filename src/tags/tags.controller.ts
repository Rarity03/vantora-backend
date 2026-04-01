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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { ApiCrud } from 'src/common/decorators/api-crud.decorator';
import { ApiTags } from '@nestjs/swagger';

const TagCrud = ApiCrud({
  entity: Tag,
  entityName: 'tag',
  entityNamePlural: 'tags',
  createDto: CreateTagDto,
  updateDto: UpdateTagDto
});

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @TagCrud.ApiCreate()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @TagCrud.ApiFindAll()
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @TagCrud.ApiFindOne()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @TagCrud.ApiUpdate()
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @TagCrud.ApiRemove()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagsService.remove(id);
  }
}