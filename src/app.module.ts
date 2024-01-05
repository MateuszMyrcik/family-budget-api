import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthzModule } from './authz/authz.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { HouseholdsModule } from './households/households.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { BudgetsModule } from './budgets/budgets.module';

const DB_PASSWORD = process.env.DB_PASSWORD || '';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://mati:${DB_PASSWORD}@cluster0.gs8zv.mongodb.net/family_budget?retryWrites=true&w=majority`,
    ),
    TransactionsModule,
    AuthzModule,
    UsersModule,
    HouseholdsModule,
    ClassificationsModule,
    BudgetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
