import { UniqueID } from './shared';

export type Ownership = {
  ownerID: UniqueID;
  groupID: UniqueID;
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

export type Cost = {
  currency: string;
  value: number;
};

export type ExpenseDBEntity = {
  cyclic: boolean;
  groupCategory: GroupCategory;
  category: string;
  name: string;
  cost: Cost;
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
