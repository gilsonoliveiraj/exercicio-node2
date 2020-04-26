import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

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
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    let categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      categoryExists = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryExists);
    }

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('Not enough balance for the transaction');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryExists,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
