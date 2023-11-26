import { Module, forwardRef } from '@nestjs/common';
import { HouseholdsService } from './households.service';
import { HouseholdsController } from './households.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Household, HouseholdSchema } from './schemas/household.schema';
import { UsersModule } from 'src/users/users.module';
import { ClassificationsModule } from 'src/classifications/classifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Household.name, schema: HouseholdSchema },
    ]),
    UsersModule,
    forwardRef(() => ClassificationsModule),
  ],
  controllers: [HouseholdsController],
  providers: [HouseholdsService],
  exports: [HouseholdsService],
})
export class HouseholdsModule {}
