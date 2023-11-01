import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLES, UserRole } from 'src/shared';
import { UniqueId } from 'src/shared/commonTypes';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class User {
  @Prop({ required: true, type: String })
  _id: UniqueId; // Using UniqueId (string) for _id

  @Prop({ required: true })
  email: string;

  @Prop()
  nickname: string;

  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  groupId: UniqueId;

  @Prop()
  avatarUrl: string;

  @Prop({ enum: USER_ROLES })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
