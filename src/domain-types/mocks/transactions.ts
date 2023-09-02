import { Transaction } from '../fe-shared/domain';

export const MOCKED_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    groupCategory: 'SHOPPING',
    category: 'ALCOHOL',
    categoryLabel: 'Alkohol',
    groupCategoryLabel: 'Zakupy',
    name: 'Salary',
    type: 'EXPENSE',
    ownership: { ownerId: '1', familyId: '1' },
    amount: { value: 50, currency: 'PLN' },
    date: new Date(),
  },
  {
    id: '2',
    groupCategory: 'SHOPPING',
    category: 'FOOD',
    categoryLabel: 'Jedzenie',
    groupCategoryLabel: 'Zakupy',
    name: 'Biedronka',
    type: 'EXPENSE',
    ownership: { ownerId: '1', familyId: '1' },
    amount: { value: 50, currency: 'PLN' },
    date: new Date(),
  },
];
