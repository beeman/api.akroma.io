import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiImplicitQuery, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Block } from './models/block';
import { BlocksService } from './services/blocks.service';

@ApiUseTags('Blocks')
@Controller('blocks')
export class BlocksController {
  constructor(
    private readonly blocksService: BlocksService,
  ) { }

  @Get()
  @ApiImplicitQuery({
    name: 'before_block',
    required: false,
    description: 'Search for blocks before given block number',
    type: 'number',
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    description: 'Limit results (default: 100, max: 200)',
    type: 'number',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  async getAll(
    @Query('before_block') beforeBlockId: number = Infinity,
    @Query('limit') limit: number = 100,
  ): Promise<Block[]> {
    return await this.blocksService
      .getAll(beforeBlockId, limit);
  }

  @Get(':number')
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: `Block doesn't exist` })
  async findOne(@Param('number') blockNumber: number): Promise<Block> {
    const block = await this.blocksService
      .findOne(blockNumber);

    if (!block) { throw new HttpException(`Block doesn't exist`, HttpStatus.NOT_FOUND); }

    return block;
  }
}
