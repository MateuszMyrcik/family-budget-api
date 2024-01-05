import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Household } from 'src/households/schemas/household.schema';
import { BudgetRecord } from 'src/shared';
import { User } from 'src/users/schemas/user.schema';
import { BudgetRecordSchema } from './budget-record.schema';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema()
export class Budget {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true, type: [BudgetRecordSchema] })
  records: BudgetRecord[];

  @Prop({ type: String, required: true, ref: 'User' })
  creator: User;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Household',
  })
  household: Household;
}
export const BudgetSchema = SchemaFactory.createForClass(Budget);
