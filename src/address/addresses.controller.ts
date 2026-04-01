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
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { Address } from './entities/address.entity';
import { ApiCrud } from '../common/decorators/api-crud.decorator';

const AddressCrud = ApiCrud({
  entity: Address,
  entityName: 'dirección',
  entityNamePlural: 'direcciones',
  createDto: CreateAddressDto,
  updateDto: UpdateAddressDto,
});

@ApiTags('User Addresses')
@ApiBearerAuth('access-token')
@Controller('users/me/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @AddressCrud.ApiCreate()
  @Post()
  create(@Req() req: any, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.id;
    return this.addressesService.createForUser(userId, createAddressDto);
  }

  @AddressCrud.ApiFindAll()
  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id;
    return this.addressesService.findAllByUser(userId);
  }

  @AddressCrud.ApiFindOne({
    paramName: 'addressId'
  })
  @Get(':addressId')
  findOne(
    @Req() req: any,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ) {
    const userId = req.user.id;
    return this.addressesService.findOneByUser(userId, addressId);
  }

  @AddressCrud.ApiUpdate({
    summary: 'Actualizar una dirección',
    paramName: 'addressId',
  })
  @Put(':addressId')
  update(
    @Req() req: any,
    @Param('addressId', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const userId = req.user.id;
    return this.addressesService.updateForUser(
      userId,
      addressId,
      updateAddressDto,
    );
  }

  @AddressCrud.ApiRemove({
    summary: 'Eliminar una dirección',
    paramName: 'addressId',
  })
  @Delete(':addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('addressId', ParseUUIDPipe) addressId: string) {
    const userId = req.user.id;
    return this.addressesService.removeForUser(userId, addressId);
  }
}
