import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiImplicitQuery, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { PagingObject } from '../models/paging-object';
import { Transaction } from '../transactions/models/transaction';

import { Address } from './models/address';
import { AddressesService } from './services/addresses.service';

@ApiUseTags('Addresses')
@Controller('addresses')
export class AddressController {
  constructor(
    private readonly addressesService: AddressesService,
  ) { }

  @Get(':address')
  @ApiResponse({ status: HttpStatus.OK })
  findOne(@Param('address') address: string): Promise<Address> {
    return this.addressesService
      .findOne(address);
  }

  @Get(':address/transactions')
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    description: 'Limit results (default: 100, max: 200)',
    type: 'Number',
  })
  @ApiImplicitQuery({
    name: 'offset',
    required: false,
    description: 'Offset results (default: 0)',
    type: 'Number',
  })
  @ApiResponse({ status: HttpStatus.OK })
  getTransactionsForAddress(
    @Param('address') address: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<PagingObject<Transaction>> {
    return this.addressesService
      .getTransactionsForAddress(address, +limit, +offset);
  }
}
