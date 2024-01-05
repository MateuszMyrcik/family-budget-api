import { UniqueId } from 'src/shared/commonTypes';
import { ClassificationRecord } from './classification';

export type Budget = {
  id: string;
  year: number;
  month: number;
  records: BudgetRecord[];
};

export type BudgetRecord = {
  _id: UniqueId;
  year: number;
  month: number;
  actualTotal: number;
  plannedTotal: number;
  classification: ClassificationRecord;
};

export type GetBudgetDto = {
  year: number;
  month: number;
};

export type GetBudgetResponse = BudgetRecord[];
export type CreateBudgetResponse = BudgetRecord[];
export type UpdateBudgetRecordResponse = BudgetRecord;

export type CreateBudgetDto = {
  year: number;
  month: number;
};

export type UpdateBudgetRecordDto = {
  recordId: string;
  plannedTotal: number;
};
