import { createLookup } from '../../utils';
import { ExpenseCategory } from '../types/expense';
import {
  ExpenseGroupCategory,
  IncomeCategory,
  IncomeGroupCategory,
} from '../types/shared';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  // TODO: after move to BE remove
  'FOOD',
  'TAKEAWAY',
  'ALCOHOL',
  'RENT',
  'UTILITIES',
  'MAINTENANCE',
  'PUBLIC_TRANSPORT',
  'FUEL',
  'CAR',
  'DOCTOR',
  'PHARMACY',
  'GYM',
  'CINEMA',
  'BOOKS',
  'OTHER',
];

export const EXPENSE_CATEGORY = createLookup(EXPENSE_CATEGORIES); // TODO: after move to BE remove

export const EXPENSE_GROUP_CATEGORIES = [
  // TODO: after move to BE remove
  'SHOPPING',
  'HOUSING',
  'TRANSPORT',
  'HEALTHCARE',
  'ENTERTAINMENT',
  'OTHER',
] as const;

export const EXPENSE_GROUP_CATEGORY = createLookup([
  // TODO: after move to BE remove
  ...EXPENSE_GROUP_CATEGORIES,
]);

export const EXPENSE_GROUP_CATEGORY_BY_CATEGORY: Record<
  // TODO: after move to BE remove
  ExpenseCategory,
  ExpenseGroupCategory
> = {
  FOOD: EXPENSE_GROUP_CATEGORY.SHOPPING,
  TAKEAWAY: EXPENSE_GROUP_CATEGORY.SHOPPING,
  ALCOHOL: EXPENSE_GROUP_CATEGORY.SHOPPING,
  RENT: EXPENSE_GROUP_CATEGORY.HOUSING,
  UTILITIES: EXPENSE_GROUP_CATEGORY.HOUSING,
  MAINTENANCE: EXPENSE_GROUP_CATEGORY.HOUSING,
  PUBLIC_TRANSPORT: EXPENSE_GROUP_CATEGORY.TRANSPORT,
  FUEL: EXPENSE_GROUP_CATEGORY.TRANSPORT,
  CAR: EXPENSE_GROUP_CATEGORY.TRANSPORT,
  DOCTOR: EXPENSE_GROUP_CATEGORY.HEALTHCARE,
  PHARMACY: EXPENSE_GROUP_CATEGORY.HEALTHCARE,
  GYM: EXPENSE_GROUP_CATEGORY.ENTERTAINMENT,
  CINEMA: EXPENSE_GROUP_CATEGORY.ENTERTAINMENT,
  BOOKS: EXPENSE_GROUP_CATEGORY.ENTERTAINMENT,
  OTHER: EXPENSE_GROUP_CATEGORY.OTHER,
};

export const INCOME_CATEGORIES: IncomeCategory[] = [
  // TODO: after move to BE remove
  'DIVIDENDS',
  'FULL_TIME',
  'FREELANCE',
  'INTEREST',
  'OTHER',
  'PART_TIME',
  'RENTAL_INCOME',
];

export const INCOME_CATEGORY = createLookup(INCOME_CATEGORIES); // TODO: after move to BE remove

export const INCOME_GROUP_CATEGORIES = [
  // TODO: after move to BE remove
  'SALARY',
  'INVESTMENTS',
  'OTHER',
] as const;

export const INCOME_GROUP_CATEGORY = createLookup([...INCOME_GROUP_CATEGORIES]); // TODO: after move to BE remove

export const INCOME_GROUP_CATEGORY_BY_CATEGORY: Record<
  // TODO: after move to BE remove
  IncomeCategory,
  IncomeGroupCategory
> = {
  OTHER: INCOME_GROUP_CATEGORY.OTHER,
  INTEREST: INCOME_GROUP_CATEGORY.INVESTMENTS,
  DIVIDENDS: INCOME_GROUP_CATEGORY.INVESTMENTS,
  FULL_TIME: INCOME_GROUP_CATEGORY.SALARY,
  FREELANCE: INCOME_GROUP_CATEGORY.SALARY,
  PART_TIME: INCOME_GROUP_CATEGORY.SALARY,
  RENTAL_INCOME: INCOME_GROUP_CATEGORY.OTHER,
};

export const TRANSACTION_TYPES = ['EXPENSE', 'INCOME'] as const;

export const TRANSACTION_TYPE = createLookup([...TRANSACTION_TYPES]);
