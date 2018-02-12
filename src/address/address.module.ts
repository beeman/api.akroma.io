import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlockSchema } from '../blocks/schemas/block.schema';
import { TransactionSchema } from '../transactions/schemas/transaction.schema';

import { AddressController } from './address.controller';
import { AddressesService } from './services/addresses.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Block', schema: BlockSchema },
    ]),
  ],
  controllers: [
    AddressController,
  ],
  components: [
    AddressesService,
  ],
})
export class AddressModule { }
