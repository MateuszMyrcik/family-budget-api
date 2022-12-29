import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpensesModule } from './expenses/expenses.module';
import { MongooseModule } from '@nestjs/mongoose';
import { IncomesModule } from './incomes/incomes.module';

const DB_PASSWORD = process.env.DB_PASSWORD; // TODO: adjust to production

@Module({
  imports: [
    ExpensesModule,
    MongooseModule.forRoot(
      `mongodb+srv://mati:${DB_PASSWORD}@cluster0.gs8zv.mongodb.net/family_budget?retryWrites=true&w=majority`,
    ),
    IncomesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
