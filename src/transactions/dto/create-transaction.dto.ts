import { Amount, TransactionType } from 'src/shared';

export class CreateTransactionDto {
  name: string;
  date: Date;
  type: TransactionType;
  amount: Amount;
  comment?: string;
  categoryId: string;
  groupCategoryId: string;
}
