import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassificationsModule } from 'src/classifications/classifications.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import {
  BudgetRecord,
  BudgetRecordSchema,
} from './schemas/budget-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BudgetRecord.name, schema: BudgetRecordSchema },
    ]),
    TransactionsModule,
    ClassificationsModule,
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
