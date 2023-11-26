import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClassificationGroupDocument =
  HydratedDocument<ClassificationGroupCategory>;

@Schema()
export class ClassificationGroupCategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  decorationColor: string;

  @Prop({ required: true })
  householdId: string;
}

export const GroupCategorySchema = SchemaFactory.createForClass(
  ClassificationGroupCategory,
);
