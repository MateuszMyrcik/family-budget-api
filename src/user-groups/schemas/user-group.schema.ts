import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserGroupDocument = HydratedDocument<UserGroup>;

@Schema()
export class UserGroup {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  membersIds: string[];
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);
