import { Component } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

// import { Block } from '../../blocks/models/block';
// import { BlockSchema } from '../../blocks/schemas/block.schema';
import { PagingObject } from '../../models/paging-object';
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
        .lean()
        .select('-_id')
        .exec(),
    };

    return address as Address;
  }

  async getTransactionsForAddress(addressHash: string, limit: number = 20, offset: number = 0): Promise<PagingObject<Transaction>> {
    const countQuery = this.transactionModel
      .find({
        $or: [
          { to: addressHash.toLowerCase() },
          { from: addressHash.toLowerCase() },
        ],
      })
      .count();

    const query = this.transactionModel
      .find({
        $or: [
          { to: addressHash.toLowerCase() },
          { from: addressHash.toLowerCase() },
        ],
      })
      .sort('-timestamp')
      .skip(offset * limit)
      .limit(limit)
      .lean()
      .select('-_id');

    const [items, total] = await Promise.all([query, countQuery]);

    const transactions: PagingObject<Transaction> = {
      limit,
      offset,
      total,
      items: items as Transaction[],
      next: this.getNextUrl(limit, offset, total),
      previous: this.getPreviousUrl(limit, offset, total),
    };

    return transactions;
  }

  private getNextUrl(limit: number, offset: number, total: number): string | null {
    const updatedOffset = offset + 1;
    const hasOnlyOnePage = limit >= total;
    const isOnLastPage = (updatedOffset * limit) >= total;

    if (hasOnlyOnePage || isOnLastPage) {
      return null;
    }

    return `?limit=${limit}&offset=${offset + 1}`;
  }

  private getPreviousUrl(limit: number, offset: number, total: number): string | null {
    const hasOnlyOnePage = limit >= total;
    const isOnFirstPage = offset === 0 && total >= limit;

    if (hasOnlyOnePage || isOnFirstPage) {
      return null;
    }

    return `?limit=${limit}&offset=${offset - 1}`;
  }
}
