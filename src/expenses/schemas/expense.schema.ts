import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Cost,
  GroupCategory,
  Metadata,
  Ownership,
  RangeDate,
} from 'src/domain-types';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
  @Prop({ required: true })
  cyclic: boolean;

  @Prop({ required: true })
  groupCategory: GroupCategory;

  @Prop({ required: true, enum: ['POWER', 'GROCERIES'] })
  category: 'POWER' | string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, required: true })
  cost: Cost;

  @Prop({ type: Object, required: true })
  ownership: Ownership;

  @Prop({ type: Object, required: true })
  metadata: Metadata;

  @Prop({ type: Object })
  rangeDate?: RangeDate;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
