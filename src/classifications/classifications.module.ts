import { Module, forwardRef } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';
import { ClassificationsController } from './classifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Classification,
  ClassificationSchema,
} from './schemas/classification.schema';
import {
  ClassificationGroupCategory,
  GroupCategorySchema,
} from './schemas/classification-group.schema';

import { HouseholdsModule } from 'src/households/households.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Classification.name, schema: ClassificationSchema },
    ]),
    MongooseModule.forFeature([
      { name: ClassificationGroupCategory.name, schema: GroupCategorySchema },
    ]),
    forwardRef(() => HouseholdsModule),
  ],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
