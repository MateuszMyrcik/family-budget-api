import { BudgetDto } from './budget.dto';
export const BudgetDtoStub = (): BudgetDto => ({
  id: '1',
  month: 12,
  records: [],
  year: 2023,
  creatorId: '1',
  householdId: '1',
});
