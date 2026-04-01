import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CrudService } from '../common/global/crud.service';

@Injectable()
export class TagsService extends CrudService<Tag> {
  constructor(
    @InjectRepository(Tag)
    tagRepository: Repository<Tag>,
  ) {
    super(tagRepository);
  }
}
