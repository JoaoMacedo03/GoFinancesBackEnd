import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income: number = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(
        (total, transaction) => Number(total) + Number(transaction.value),
        0,
      );
    const outcome: number = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(
        (total, transaction) => Number(total) + Number(transaction.value),
        0,
      );
    const total: number = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };
    return balance;
  }
}

export default TransactionsRepository;
