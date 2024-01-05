import { Budget, BudgetRecord, UniqueId } from 'src/shared';

export class BudgetDto implements Budget {
  readonly id: UniqueId;
  readonly year: number;
  readonly month: number;
  readonly creatorId: UniqueId;
  readonly householdId: UniqueId;
  readonly records: BudgetRecord[];
}
