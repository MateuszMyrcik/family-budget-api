import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ClassificationsService } from 'src/classifications/classifications.service';
import { HouseholdsService } from 'src/households/households.service';
import {
  CreateBudgetResponse,
  GetBudgetResponse,
  UniqueId,
  UpdateBudgetRecordResponse,
} from 'src/shared';
import { GetBudgetDto } from './dto/get-budget.dto';
import { UpdateBudgetRecordDto } from './dto/update-budget-record.dto';

import { TransactionsService } from 'src/transactions/transactions.service';
import { DeleteResult, ObjectId } from 'mongodb';
import { BudgetRecord as BudgetRecordSchema } from './schemas/budget-record.schema';
import { InvalidMonthException } from './exceptions/invalid-month.exceptions';
import { InvalidYearException } from './exceptions/invalid-year.excetpions';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(BudgetRecordSchema.name)
    @InjectModel('BudgetRecord')
    public budgetRecordModel: Model<BudgetRecordSchema>,
    @Inject(forwardRef(() => HouseholdsService))
    private householdService: HouseholdsService,
    @Inject(forwardRef(() => ClassificationsService))
    private classificationService: ClassificationsService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionService: TransactionsService,
  ) {}

  async createBudget(
    { month, year }: CreateBudgetDto,
    userId: UniqueId,
  ): Promise<CreateBudgetResponse> {
    if (month < 1 || month > 12) {
      throw new InvalidMonthException();
    }

    if (year < 1990 || year > 2050) {
      throw new InvalidYearException();
    }

    const householdId = await this.householdService.getHouseholdIdByUserId(
      userId,
    );

    const found = await this.budgetRecordModel.findOne({
      householdId,
      year,
      month,
    });

    if (found) {
      throw new BadRequestException('Budget already exists');
    }

    const classificationRecords = (
      await this.classificationService.getUserClassifications(householdId)
    ).filter((classification) => classification.type === 'EXPENSE');

    const createdRecords = await Promise.all(
      classificationRecords.map(async (classification) => {
        const actualTotal = await this.getClassificationActualTotal({
          classificationId: classification._id,
          householdId,
          year,
          month,
        });

        const createdRecord = await new this.budgetRecordModel({
          classification: classification._id,
          plannedTotal: 0,
          actualTotal,
          household: householdId,
          creator: userId,
          year,
          month,
        }).populate('classification');

        return createdRecord.save();
      }),
    );

    await Promise.all(createdRecords.map((record) => record.save()));

    return createdRecords.map((record) => {
      return {
        _id: record._id.toString(),
        classification: record.classification,
        actualTotal: record.actualTotal,
        month: record.month,
        year: record.year,
        plannedTotal: record.plannedTotal,
      };
    });
  }

  async getPeriodicBudgetRecords(
    { month, year }: GetBudgetDto,
    userId: UniqueId,
  ): Promise<GetBudgetResponse> {
    const householdId = await this.householdService.getHouseholdIdByUserId(
      userId,
    );

    const foundRecords = await this.budgetRecordModel
      .find({
        household: householdId,
        year,
        month,
      })
      .populate('classification');

    if (!foundRecords.length) {
      throw new BadRequestException('Budget records not found');
    }

    const mappedRecords = await Promise.all(
      foundRecords.map(async (record) => {
        const actualTotal = await this.getClassificationActualTotal({
          classificationId: record.classification._id,
          householdId,
          year,
          month,
        });

        return {
          _id: record._id.toString(),
          classification: record.classification,
          actualTotal: actualTotal,
          month: record.month,
          year: record.year,
          plannedTotal: record.plannedTotal,
        };
      }),
    );

    return mappedRecords;
  }

  async updateBudgetRecord(
    dto: UpdateBudgetRecordDto,
    userId: UniqueId,
  ): Promise<UpdateBudgetRecordResponse> {
    const householdId = await this.householdService.getHouseholdIdByUserId(
      userId,
    );

    const found = await this.budgetRecordModel
      .findOne({
        householdId,
        _id: dto.recordId,
      })
      .populate('classification');

    if (!found) {
      throw new BadRequestException('Budget record not found');
    }

    found.plannedTotal = dto.plannedTotal;

    await found.save();

    return {
      _id: found._id.toString(),
      classification: found.classification,
      actualTotal: found.actualTotal,
      month: found.month,
      year: found.year,
      plannedTotal: found.plannedTotal,
    };
  }

  async syncBudgetsWithClassificationState({
    action,
    householdId,
    classificationId,
  }: {
    action: 'ADD' | 'REMOVE';
    householdId: ObjectId;
    classificationId: ObjectId;
  }) {
    const records = await this.budgetRecordModel.find({ householdId });
    const periods: {
      month: number;
      year: number;
    }[] = [];

    records.forEach((budget) => {
      if (
        !periods.some(
          (period) =>
            period.month === budget.month && period.year === budget.year,
        )
      ) {
        periods.push({
          month: budget.month,
          year: budget.year,
        });
      }
    });

    return await Promise.all(
      periods.map(async (period) => {
        const foundRecord = await this.budgetRecordModel.findOne({
          householdId,
          classification: classificationId,
          month: period.month,
          year: period.year,
        });

        if (action === 'ADD' && !foundRecord) {
          const createdRecord = await new this.budgetRecordModel({
            classification: classificationId,
            plannedTotal: 0,
            actualTotal: 0,
            household: householdId,
            creator: householdId,
            year: period.year,
            month: period.month,
          });

          return createdRecord.save();
        }

        if (action === 'REMOVE' && foundRecord) {
          return foundRecord.remove();
        }
      }),
    );
  }

  async deleteHouseholdBudget(userId: UniqueId): Promise<DeleteResult> {
    const householdId = await this.householdService.getHouseholdIdByUserId(
      userId,
    );

    return await this.budgetRecordModel.deleteMany({ householdId });
  }

  async getClassificationActualTotal({
    classificationId,
    householdId,
    year,
    month,
  }: {
    classificationId: string;
    householdId: ObjectId;
    year: number;
    month: number;
  }) {
    const { transactions } =
      await this.transactionService.getTransactionsByDateScope(
        {
          startDate: new Date(year, month - 1, 1),
          endDate: new Date(year, month, 0),
        },
        householdId,
      );

    const classificationTransactions = transactions.filter((transaction) => {
      return (
        transaction.classificationRecord._id.toString() ===
        classificationId.toString()
      );
    });

    return classificationTransactions.reduce(
      (acc, curr) => acc + curr.amount.value,
      0,
    );
  }
}
