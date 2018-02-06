import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('Mobile')
@Controller('mobile')
export class MobileController {
  constructor(
  ) { }

  @Get('/prices')
  @ApiResponse({ status: HttpStatus.OK })
  async findOne(
  ): Promise<[any]> {
    return [{ 'id': 'akroma', 'name': 'Akroma', 'symbol': 'AKA', 'price': '1.00', 'percent_change_24h': '11.27' }];
  }
}
