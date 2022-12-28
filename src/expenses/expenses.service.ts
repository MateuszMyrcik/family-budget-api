import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import { UniqueID } from 'src/domain-types/shared';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, ExpenseDocument } from './schemas/expense.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(createCatDto: CreateExpenseDto): Promise<Expense> {
    const createdExpense = new this.expenseModel(createCatDto);
    return createdExpense.save();
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseModel.find().exec();
  }

  async findOne(id: UniqueID): Promise<Expense> {
    return this.expenseModel.findOne({ _id: id });
  }

  async update(
    id: UniqueID,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<UpdateResult> {
    return this.expenseModel.updateOne(updateExpenseDto);
  }

  async remove(id: UniqueID): Promise<DeleteResult> {
    return this.expenseModel.deleteOne({ _id: id });
  }
}
