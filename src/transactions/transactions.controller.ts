import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiImplicitQuery, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Transaction } from './models/transaction';
import { TransactionsService } from './services/transactions.service';

@ApiUseTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) { }

  @Get()
  @ApiImplicitQuery({
    name: 'before_ts',
    required: false,
    description: 'Search for transactions before given timestamp',
    type: 'number',
  })
  @ApiImplicitQuery({
    name: 'input',
    required: false,
    description: 'Search for transactions by given input',
    type: 'string',
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    description: 'Limit results (default: 100, max: 200)',
    type: 'number',
  })
  @ApiResponse({ status: HttpStatus.OK })
  async getAll(
    @Query('before_ts') beforeTimestamp: number = Infinity,
    @Query('input') input: string = '0x',
    @Query('limit') limit: number = 100,
  ): Promise<Transaction[]> {
    return await this.transactionsService
      .getAll(beforeTimestamp, input, limit);
  }

  @Get(':hash')
  @ApiResponse({ status: HttpStatus.OK })
  async findOne(@Param('hash') transactionHash: string): Promise<Transaction> {
    return await this.transactionsService
      .findOne(transactionHash);
  }
}
