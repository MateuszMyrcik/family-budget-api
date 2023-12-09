import {
  Amount,
  CreateCyclicTransactionRequest,
  Frequency,
  UniqueId,
} from 'src/shared';

export class CreateCyclicTransactionDto
  implements CreateCyclicTransactionRequest
{
  name: string;
  amount: Amount;
  comment?: string;
  creatorId: UniqueId;
  householdId: UniqueId;
  classificationRecordId: UniqueId;
  frequency: Frequency;
  occurrences: number;
  startDate: Date;
}
