import {
  Controller,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ApiCrud } from '../../common/decorators/api-crud.decorator';
import { UpdateUserDto } from './dtos/update-user-dto';
import { CreateUserDto } from './dtos/create-user-dto';

const UserCrud = ApiCrud({
  entity: User,
  entityName: 'usuario',
  entityNamePlural: 'usuarios',
  createDto: CreateUserDto,
  updateDto: UpdateUserDto,
});

@ApiTags('Users')
@Controller('users')
export class UsersController { 
  constructor(private readonly usersService: UsersService) {}

  @UserCrud.ApiFindAll()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UserCrud.ApiFindOne()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @UserCrud.ApiUpdate()
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(id, updateUserDto);
    return this.usersService.getProfileWithEmail(id);
  }

  @UserCrud.ApiRemove()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

}