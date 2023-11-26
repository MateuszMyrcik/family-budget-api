import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import { UniqueId } from 'src/shared';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    @InjectModel('Transaction')
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);

    return createdTransaction.save();
  }

  async findAll(userId: UniqueId): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find({
        'ownership.userId': userId,
      })
      .exec();

    return transactions;
  }

  async findOne(id: UniqueId): Promise<Transaction> {
    return this.transactionModel.findOne({ _id: id });
  }

  async update(
    id: UniqueId,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<UpdateResult> {
    return this.transactionModel.updateOne(updateTransactionDto);
  }

  async resetAll(): Promise<DeleteResult> {
    return this.transactionModel.deleteMany({});
  }

  async remove(id: UniqueId): Promise<DeleteResult> {
    return this.transactionModel.deleteOne({ _id: id });
  }
}
