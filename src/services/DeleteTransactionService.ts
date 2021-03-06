import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionToBeDeleted = await transactionsRepository.findOne(id);

    if (!transactionToBeDeleted) {
      throw new AppError("transaction doesn't exist", 404);
    }

    await transactionsRepository.remove(transactionToBeDeleted);
  }
}

export default DeleteTransactionService;
