import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlocksModule } from './blocks/blocks.module';
import { TransactionModule } from './transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      auth: {
        user: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
      },
    }),
    BlocksModule,
    TransactionModule,
  ],
})
export class ApplicationModule { }
