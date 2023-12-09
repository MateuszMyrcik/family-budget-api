import { Amount, CreateTransactionRequest, UniqueId } from 'src/shared';

export class CreateTransactionDto implements CreateTransactionRequest {
  name: string;
  amount: Amount;
  comment?: string;
  creatorId: UniqueId;
  householdId: UniqueId;
  transactionDate: Date;
  classificationRecordId: UniqueId;
}
