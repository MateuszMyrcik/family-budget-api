import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import {
  CLASSIFICATION_TYPES,
  ClassificationGroup,
  ClassificationLabel,
  TransactionType,
} from 'src/shared';

export type ClassificationDocument = HydratedDocument<Classification>;

@Schema()
export class Classification {
  @Prop({ required: true, enum: CLASSIFICATION_TYPES })
  type: TransactionType;

  @Prop({ required: true, type: Array })
  labels: ClassificationLabel[];

  @Prop({ required: true, type: Object })
  group: ClassificationGroup;

  @Prop({ required: true })
  householdId: ObjectId;

  @Prop({ required: true })
  isDeletable: boolean;

  @Prop({ required: true })
  isEditable: boolean;
}

export const ClassificationSchema =
  SchemaFactory.createForClass(Classification);
