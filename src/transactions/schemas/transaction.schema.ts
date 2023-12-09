import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  Amount,
  ClassificationRecord,
  TRANSACTION_TYPES,
  TransactionType,
  User,
  Household,
} from 'src/shared';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  transactionDate: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: Object, required: true })
  amount: Amount;

  @Prop({ type: String, required: true, ref: 'User' })
  creator: User;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Household',
  })
  household: Household;

  @Prop({ required: false })
  comment?: string;

  @Prop({ required: true, enum: TRANSACTION_TYPES })
  type: TransactionType;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ClassificationRecord',
  })
  classificationRecord: ClassificationRecord;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
