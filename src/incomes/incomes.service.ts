import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import { UniqueId } from 'src/domain-types/shared';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

import { Income, IncomeDocument } from './schemas/income.schema';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(Income.name) private incomeModel: Model<IncomeDocument>,
  ) {}

  async create(createCatDto: CreateIncomeDto): Promise<Income> {
    const createdIncome = new this.incomeModel(createCatDto);
    return createdIncome.save();
  }

  async findAll(): Promise<Income[]> {
    return this.incomeModel.find().exec();
  }

  async findOne(id: UniqueId): Promise<Income> {
    return this.incomeModel.findOne({ _id: id });
  }

  async update(
    id: UniqueId,
    updateIncomeDto: UpdateIncomeDto,
  ): Promise<UpdateResult> {
    return this.incomeModel.updateOne(updateIncomeDto);
  }

  async remove(id: UniqueId): Promise<DeleteResult> {
    return this.incomeModel.deleteOne({ _id: id });
  }
}
