import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import {
  CLASSIFICATION_TYPES,
  ClassificationGroup,
  ClassificationLabel,
  TransactionType,
} from 'src/shared';

export type ClassificationRecordDocument =
  HydratedDocument<ClassificationRecord>;

@Schema()
export class ClassificationRecord {
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

export const ClassificationRecordSchema =
  SchemaFactory.createForClass(ClassificationRecord);
