import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { USER_ROLES, UserRole } from 'src/shared';
import { UniqueId } from 'src/shared/commonTypes';
import { Household } from 'src/shared/domain/types/household';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class User {
  @Prop({ required: true, type: String })
  _id: UniqueId; // Using UniqueId (string) for _id

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  isInvitePending: boolean;

  @Prop()
  nickname: string;

  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Household' })
  household: Household;

  @Prop()
  avatarUrl: string;

  @Prop({ enum: USER_ROLES })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
