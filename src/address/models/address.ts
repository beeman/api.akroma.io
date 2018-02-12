import { Transaction } from '../../transactions/models/transaction';

export interface Address {
  hash: string;
  balance: number;
  mined: number;
  transactionsInitiatedCount: number;
  transactions: Transaction[];
}
