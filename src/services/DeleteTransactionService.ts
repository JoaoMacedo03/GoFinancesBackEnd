import { getRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    if (!uuidValidate(id)) throw new AppError('Id is not valid');

    const transactionRepository = getRepository(Transaction);

    const checkIdExists = await transactionRepository.findOne(id);

    if (!checkIdExists) throw new AppError('Id does not exist.');

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
