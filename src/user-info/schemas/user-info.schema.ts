import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/domain-types/fe-shared/domain';
import { USER_ROLES } from 'src/domain-types/fe-shared/domain/constants/user-info';
import { UniqueId } from 'src/domain-types/shared';

export type UserInfoDocument = HydratedDocument<UserInfo>;

@Schema()
export class UserInfo {
  @Prop({ required: true })
  id: UniqueId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  groupId: UniqueId;

  @Prop({ required: true, enum: USER_ROLES })
  role: UserRole;

  @Prop()
  avatarUrl: string;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
