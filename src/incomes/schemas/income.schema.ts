import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Amount,
  IncomeGroupCategory,
  Metadata,
  Ownership,
  RangeDate,
} from 'src/domain-types';

export type IncomeDocument = HydratedDocument<Income>;

@Schema()
export class Income {
  @Prop({ required: true })
  cyclic: boolean;

  @Prop({ required: true })
  groupCategory: IncomeGroupCategory;

  @Prop({ required: true, enum: ['FULL_TIME'] })
  category: 'FULL_TIME' | string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, required: true })
  amount: Amount;

  @Prop({ type: Object, required: true })
  ownership: Ownership;

  @Prop({ type: Object, required: true })
  metadata: Metadata;

  @Prop({ type: Object })
  rangeDate?: RangeDate;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
