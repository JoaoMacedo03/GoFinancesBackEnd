import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type informed is invalid');
    }

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (total < value) {
        throw new AppError(
          'You do not have money to complete this transaction',
        );
      }
    }

    let categoryData = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryData) {
      categoryData = await categoryRepository.create({ title: category });
      await categoryRepository.save(categoryData);
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category: categoryData,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
