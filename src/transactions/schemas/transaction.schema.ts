import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Amount,
  TRANSACTION_TYPES,
  TransactionType,
} from 'src/domain-types/fe-shared/domain';
import { UniqueId } from 'src/domain-types/shared';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Object, required: true })
  amount: Amount;

  @Prop({ type: Object, required: true })
  creatorId: UniqueId;

  @Prop({ required: false })
  comment?: string;

  @Prop({ required: true, enum: TRANSACTION_TYPES })
  type: TransactionType;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  groupCategoryId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
