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
// import { DevtoolsModule } from '@nestjs/devtools-integration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HouseholdsInterceptor } from './households/households.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';

const MONGODB_URI = process.env.MONGODB_URI || '';

const modules = [
  TransactionsModule,
  AuthzModule,
  UsersModule,
  HouseholdsModule,
  ClassificationsModule,
  BudgetsModule,
  // DevtoolsModule.register({
  //   http: process.env.NODE_ENV !== 'production',
  // }),
  EventEmitterModule.forRoot(),
];

if (process.env.NODE_ENV !== 'test') {
  modules.push(MongooseModule.forRoot(MONGODB_URI));
}

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HouseholdsInterceptor,
    },
  ],
})
export class AppModule {}
