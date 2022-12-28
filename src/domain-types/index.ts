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
  groupCategory: GroupCategory;
  category: string;
  name: string;
  amount: Amount;
  ownership: Ownership;
  metadata: Metadata;
  rangeDate?: RangeDate;
};

export type GroupCategory =
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
export type Income = {
  cyclic: boolean;
  groupCategory: GroupCategory;
  category: string;
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

export type Family = {
  id: string;
  primaryMember: User;
  otherMembers?: User[];
};
