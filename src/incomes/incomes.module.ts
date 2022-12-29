import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Income } from './entities/income.entity';
import { IncomeSchema } from './schemas/income.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }]),
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
