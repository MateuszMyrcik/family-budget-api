import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type InviteDocument = HydratedDocument<Invite>;

@Schema()
export class Invite {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, ref: 'User', required: true })
  sender: User;

  @Prop({ default: Date.now(), required: true })
  createdAt: Date;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
