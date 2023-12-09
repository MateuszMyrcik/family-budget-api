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
