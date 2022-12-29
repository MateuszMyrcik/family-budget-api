import { UniqueId } from './shared';

// SHARED DOMAIN TYPES
export type Ownership = {
  ownerId: UniqueId;
  familyId: UniqueId;
};

export type Metadata = {
  created: Date;
  modified: Date;
  version: Date;
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

// EXPENSES
export type Expense = {
  cyclic: boolean;
  groupCategory: string | ExpenseGroupCategory;
  category: string;
  name: string;
  amount: Amount;
  ownership: Ownership;
  metadata: Metadata;
  rangeDate?: RangeDate;
};

export type ExpenseGroupCategory =
  | 'FOOD'
  | 'OTHER'
  | 'HYGIENE'
  | 'HOUSING'
  | 'SAVINGS'
  | 'CHILDREN'
  | 'CLOTHING'
  | 'TRANSPORT'
  | 'HEALTHCARE'
  | 'ENTERTAINMENT'
  | 'OTHER_EXPENSES'
  | 'DEBT_REPAYMENT'
  | 'TELECOMMUNICATIONS';

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

export type Income = {
  cyclic: boolean;
  groupCategory: ExpenseGroupCategory;
  category: string | IncomeCategory;
  name: string;
  amount: Amount;
  ownership: Ownership;
  metadata: Metadata;
  rangeDate?: RangeDate;
};

// BUDGET
export type Budget = {
  id: string;
  month: number;
  plannedExpenses: Expense[];
  plannedIncomes: Income[];
  actualExpenses: Expense[];
  actualIncomes: Income[];
};

// USERS
export type UserRole = 'ADMIN' | 'REGULAR';

export type User = {
  id: string;
  name: string;
  surname: string;
  avatar?: Image;
  email: string;
  role: UserRole;
};

export type Household = {
  id: string;
  primaryMember: User;
  otherMembers?: User[];
};
