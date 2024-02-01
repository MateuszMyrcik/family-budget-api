import { Module } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { ClassificationsController } from './classifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClassificationRecord,
  ClassificationRecordSchema,
} from './schemas/classification-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassificationRecord.name, schema: ClassificationRecordSchema },
    ]),
  ],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
