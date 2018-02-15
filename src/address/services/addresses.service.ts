import { Component } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

// import { Block } from '../../blocks/models/block';
// import { BlockSchema } from '../../blocks/schemas/block.schema';
import { Transaction } from '../../transactions/models/transaction';
import { TransactionSchema } from '../../transactions/schemas/transaction.schema';
import { Address } from '../models/address';

@Component()
export class AddressesService {
  private web3: any;

  constructor(
    @InjectModel(TransactionSchema) private readonly transactionModel: Model<Transaction>,
    // @InjectModel(BlockSchema) private readonly blockModel: Model<Block>,
  ) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
  }

  async findOne(addressHash: string): Promise<Address> {
    const value = await this.web3.eth.getBalance(addressHash);
    const ether = new BigNumber(new BigNumber(value)).div('1000000000000000000').toString(10);

    const address: Address = {
      hash: addressHash,
      balance: ether,
      mined: 0,
      // mined: await this.blockModel.count({ miner: addressHash }).exec(),
      transactionsInitiatedCount: await this.web3.eth.getTransactionCount(addressHash),
      transactions: await this.transactionModel
        .find({
          $or: [
            { to: addressHash.toLowerCase() },
            { from: addressHash.toLowerCase() },
          ],
        })
        .limit(10)
        .sort('-blockNumber')
        .lean(true)
        .select('-_id')
        .exec(),
    };

    return address as Address;
  }
}
