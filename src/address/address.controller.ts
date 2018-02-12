import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Address } from './models/address';
import { AddressesService } from './services/addresses.service';

@ApiUseTags('Addresses')
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly addressesService: AddressesService,
  ) { }

  @Get(':hash')
  @ApiResponse({ status: HttpStatus.OK })
  async findOne(@Param('hash') address: string): Promise<Address> {
    return await this.addressesService
      .findOne(address);
  }
}