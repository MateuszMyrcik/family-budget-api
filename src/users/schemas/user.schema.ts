import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/domain-types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Object })
  avatar: string;

  @Prop({ required: true, enum: ['ADMIN', 'REGULAR'] })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
