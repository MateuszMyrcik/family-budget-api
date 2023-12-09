import { ClassificationRecord } from './classification';
import { Amount } from './shared';

import { UniqueId } from 'src/shared/commonTypes';
import { User } from './user';

export type GetTransactionsResponse = {
  transactions: Transaction[];
  //   total: number;
};
export type TransactionType = 'EXPENSE' | 'INCOME';
export enum TransactionTypeEnum {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
} // TRANSACTION

export type NotSpecificTransaction = {
  [T in TransactionType]: Transaction<T>;
}[TransactionType];

export type Transaction<T extends TransactionType = TransactionType> = {
  id: string;
  name: string;
  transactionDate: Date;
  createdAt: Date;
  amount: Amount;
  comment?: string;
  creator: User;
  classificationRecord: ClassificationRecord;
} & TransactionDetails<T>;

export type TransactionDetails<T extends TransactionType = TransactionType> = {
  EXPENSE: ExpenseDetails;
  INCOME: IncomeDetails;
}[T];

export type TransactionCategory = {
  id: UniqueId;
} & TransactionDetails;

export type ExpenseDetails = {
  type: 'EXPENSE';
};

export type IncomeDetails = {
  type: 'INCOME';
};

export type GetTransactionResponse = {
  transaction: Transaction;
};

export type CreateTransactionRequest = {
  name: string;
  amount: Amount;
  comment?: string;
  creatorId: UniqueId;
  householdId: UniqueId;
  transactionDate: Date;
  classificationRecordId: UniqueId;
};

export type UpdateTransactionRequest = CreateTransactionRequest & {
  id: UniqueId;
};

export type CreateCyclicTransactionRequest = {
  name: string;
  amount: Amount;
  comment?: string;
  creatorId: UniqueId;
  householdId: UniqueId;
  startDate: Date;
  classificationRecordId: UniqueId;
  occurrences: number;
  frequency: Frequency;
};

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
