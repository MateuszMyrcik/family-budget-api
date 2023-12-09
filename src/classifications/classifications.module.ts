import { Module, forwardRef } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { ClassificationsController } from './classifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassificationRecord,
  ClassificationRecordSchema,
} from './schemas/classification-record.schema';

import { HouseholdsModule } from 'src/households/households.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassificationRecord.name, schema: ClassificationRecordSchema },
    ]),
    forwardRef(() => HouseholdsModule),
  ],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
