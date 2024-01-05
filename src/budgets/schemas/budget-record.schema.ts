import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ClassificationRecord, Household, User } from 'src/shared';

export type BudgetRecordDocument = HydratedDocument<BudgetRecord>;

@Schema()
export class BudgetRecord {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  plannedTotal: number;

  @Prop({ required: true })
  actualTotal: number;

  @Prop({ type: String, required: true, ref: 'User' })
  creator: User;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Household',
  })
  household: Household;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'ClassificationRecord',
  })
  classification: ClassificationRecord;
}
export const BudgetRecordSchema = SchemaFactory.createForClass(BudgetRecord);
