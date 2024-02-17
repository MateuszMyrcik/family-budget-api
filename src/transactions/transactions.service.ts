import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import {
  Frequency,
  GetTransactionsResponse,
  MAX_OCCURRENCES,
  MIN_OCCURRENCES,
  TRANSACTION_FREQUENCY,
  UniqueId,
} from 'src/shared';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { ClassificationsService } from 'src/classifications/classifications.service';
import { CreateCyclicTransactionDto } from './dto/create-cyclic-transaction.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    @InjectModel('Transaction')
    private transactionModel: Model<TransactionDocument>,
    private classificationService: ClassificationsService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const classificationRecord =
      await this.classificationService.getClassification(
        createTransactionDto.classificationRecordId,
      );

    const createdTransaction = new this.transactionModel({
      name: createTransactionDto.name,
      transactionDate: createTransactionDto.transactionDate,
      createdAt: new Date(),
      amount: createTransactionDto.amount,
      comment: createTransactionDto.comment,
      creator: createTransactionDto.creatorId,
      type: classificationRecord.type,
      classificationRecord: createTransactionDto.classificationRecordId,
      household: classificationRecord.householdId,
    });

    return createdTransaction.save();
  }

  private calculateNextTransactionDate(
    startDate: Date,
    frequency: Frequency,
  ): Date {
    const transactionDate = new Date(startDate);
    switch (frequency) {
      case TRANSACTION_FREQUENCY.DAILY:
        transactionDate.setDate(transactionDate.getDate() + 1);
        break;
      case TRANSACTION_FREQUENCY.WEEKLY:
        transactionDate.setDate(transactionDate.getDate() + 7);
        break;
      case TRANSACTION_FREQUENCY.MONTHLY:
        const currentMonth = transactionDate.getMonth();
        transactionDate.setMonth(currentMonth + 1);
        // Check if the month rolled over to next one, if so adjust to the last day of intended month
        if (transactionDate.getMonth() !== (currentMonth + 1) % 12) {
          transactionDate.setDate(0); // Set to last day of previous month
        }
        break;
      case TRANSACTION_FREQUENCY.YEARLY:
        const currentYear = transactionDate.getFullYear();
        transactionDate.setFullYear(currentYear + 1);
        // Similar check for leap year
        if (transactionDate.getFullYear() !== currentYear + 1) {
          transactionDate.setDate(0); // Adjust to last day of February
        }
        break;
      default:
        throw new BadRequestException('Invalid frequency');
    }
    return transactionDate;
  }

  async createCyclicTransaction(
    createCyclicTransactionDto: CreateCyclicTransactionDto,
  ): Promise<Transaction[]> {
    if (new Date(createCyclicTransactionDto.startDate) < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (createCyclicTransactionDto.occurrences <= MIN_OCCURRENCES) {
      throw new BadRequestException(
        `Occurrences must be greater than ${MIN_OCCURRENCES}`,
      );
    }

    if (createCyclicTransactionDto.occurrences > MAX_OCCURRENCES) {
      throw new BadRequestException(
        `Occurrences must be less than ${MAX_OCCURRENCES}`,
      );
    }

    const classificationRecord =
      await this.classificationService.getClassification(
        createCyclicTransactionDto.classificationRecordId,
      );

    const createdTransactions = [];
    const { occurrences, startDate, frequency } = createCyclicTransactionDto;

    for (let i = 0; i < occurrences; i++) {
      const transactionDate =
        createdTransactions.length > 0
          ? this.calculateNextTransactionDate(
              createdTransactions[createdTransactions.length - 1]
                .transactionDate,
              frequency,
            )
          : startDate;

      const createdTransaction = new this.transactionModel({
        name: createCyclicTransactionDto.name,
        transactionDate,
        createdAt: new Date(),
        amount: createCyclicTransactionDto.amount,
        comment: createCyclicTransactionDto.comment,
        creator: createCyclicTransactionDto.creatorId,
        type: classificationRecord.type,
        classificationRecord: createCyclicTransactionDto.classificationRecordId,
        household: classificationRecord.householdId,
      });
      createdTransactions.push(createdTransaction);
    }

    return this.transactionModel.insertMany(createdTransactions);
  }

  async findAllTransactions(): Promise<Transaction[]> {
    return this.transactionModel
      .find()
      .populate('classificationRecord')
      .populate('creator')
      .exec();
  }

  async getTransactions(
    householdId: ObjectId,
  ): Promise<GetTransactionsResponse> {
    const findTransactions = await this.transactionModel
      .find({ household: householdId })
      .populate('classificationRecord')
      .populate('creator')
      .exec();

    if (!findTransactions) {
      return {
        transactions: [],
      };
    }

    const normalizedTransactions = findTransactions.map((transaction) => {
      const {
        _id,
        name,
        createdAt,
        amount,
        comment,
        classificationRecord,
        creator,
        type,
        transactionDate,
      } = transaction;

      return {
        id: _id.toString(),
        name,
        transactionDate,
        createdAt,
        amount,
        creator,
        type,
        comment,
        classificationRecord,
      };
    });

    return {
      transactions: normalizedTransactions,
    };
  }

  async findTransactionsByDate(
    {
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    },
    householdId: ObjectId,
  ): Promise<GetTransactionsResponse> {
    const findTransactions = await this.transactionModel
      .find({
        household: householdId,
        transactionDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate('classificationRecord')
      .populate('creator')
      .exec();

    if (!findTransactions) {
      return {
        transactions: [],
      };
    }

    const normalizedTransactions = findTransactions.map((transaction) => {
      const {
        _id,
        name,
        createdAt,
        amount,
        comment,
        classificationRecord,
        creator,
        type,
        transactionDate,
      } = transaction;

      return {
        id: _id.toString(),
        name,
        transactionDate,
        createdAt,
        amount,
        creator,
        type,
        comment,
        classificationRecord,
      };
    });

    return {
      transactions: normalizedTransactions,
    };
  }

  async getTransactionById(id: UniqueId): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({ _id: id });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  // TODO: Return the updated transaction
  async updateTransactionById(
    id: UniqueId,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<UpdateResult> {
    await this.ensureTransactionExists(id);

    const updateTransaction = await this.transactionModel.updateOne(
      { _id: id },
      updateTransactionDto,
    );

    return updateTransaction;
  }

  async deleteTransaction(transactionId: UniqueId): Promise<DeleteResult> {
    await this.ensureTransactionExists(transactionId);

    return this.transactionModel.deleteOne({ _id: transactionId });
  }

  async deleteHouseholdTransactions(
    householdId: ObjectId,
  ): Promise<DeleteResult> {
    return this.transactionModel.deleteMany({ household: householdId });
  }

  private async ensureTransactionExists(transactionId: UniqueId) {
    const exists = await this.transactionModel.exists({ _id: transactionId });

    if (!exists) {
      throw new NotFoundException('Transaction not found');
    }
  }

  @OnEvent('household.deleted')
  async onHouseholdDelete(householdId: ObjectId) {
    await this.deleteHouseholdTransactions(householdId);
  }
}
