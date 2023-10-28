import { UniqueId } from '../../commonTypes';

// SHARED DOMAIN TYPES
export type Ownership = {
  ownerId: UniqueId;
  familyId: UniqueId;
};

export type Metadata = {
  created: Date;
  modified: Date;
  version: number;
};

export type RangeDate = {
  start: Date;
  end: Date;
};

export type Amount = {
  currency: string;
  value: number;
};

export type Image = {
  alt: string;
  width?: number;
  height?: number;
  url: string;
};

// TRANSACTION
export type NotSpecificTransaction = {
  [T in TransactionType]: Transaction<T>;
}[TransactionType];

export type Transaction<T extends TransactionType = TransactionType> = {
  id: string;
  name: string;
  date: Date;
  amount: Amount;
  comment?: string;
  ownership: { ownerId: string; familyId: string };
} & TransactionDetails<T>;

export type TransactionDetails<T extends TransactionType = TransactionType> = {
  EXPENSE: ExpenseDetails;
  INCOME: IncomeDetails;
}[T];

export type TransactionCategory = {
  id: UniqueId;
  // iconName?: string;
  // groupColor?: string;
} & TransactionDetails;

export type ExpenseDetails = {
  groupCategory: ExpenseGroupCategory | string;
  category: string;
  groupCategoryLabel: string;
  categoryLabel: string;
  type: 'EXPENSE';
};

export type IncomeDetails = {
  groupCategory: IncomeGroupCategory | string;
  category: IncomeCategory | string;
  groupCategoryLabel: string;
  categoryLabel: string;
  type: 'INCOME';
};

export type TransactionType = 'EXPENSE' | 'INCOME';

export enum TransactionTypeEnum {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

// EXPENSES
export type ExpenseGroupCategory =
  | 'SHOPPING'
  | 'OTHER'
  | 'HOUSING'
  | 'TRANSPORT'
  | 'HEALTHCARE'
  | 'ENTERTAINMENT';

// INCOME
export type IncomeGroupCategory = 'SALARY' | 'INVESTMENTS' | 'OTHER';

export type IncomeCategory =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'FREELANCE'
  | 'RENTAL_INCOME'
  | 'INTEREST'
  | 'DIVIDENDS'
  | 'OTHER';

// BUDGET
export type Budget = {
  id: string;
  year: number;
  month: number;
  categoryRecords: BudgetCategoryRecord[];
};

export type BudgetCategoryRecord = {
  category: string;
  groupCategory: string;
  categoryLabel: string;
  groupCategoryLabel: string;
  plannedTotal: number;
  actualTotal: number;
};
