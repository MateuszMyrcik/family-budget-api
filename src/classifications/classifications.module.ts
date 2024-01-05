import { Module, forwardRef } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { ClassificationsController } from './classifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassificationRecord,
  ClassificationRecordSchema,
} from './schemas/classification-record.schema';

import { HouseholdsModule } from 'src/households/households.module';
import { BudgetsModule } from 'src/budgets/budgets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassificationRecord.name, schema: ClassificationRecordSchema },
    ]),
    forwardRef(() => HouseholdsModule),
    forwardRef(() => BudgetsModule),
  ],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
