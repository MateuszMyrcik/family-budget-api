import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Invite, InviteSchema } from './invite.schema';
import * as mongoose from 'mongoose';

export type HouseholdDocument = HydratedDocument<Household>;

@Schema()
export class Household {
  @Prop()
  name: string;

  @Prop([{ type: String, ref: 'User' }])
  members: User[];

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ type: String, ref: 'User' })
  owner: User;

  @Prop({ type: [InviteSchema] })
  pendingInvites: Invite[];
}

export const HouseholdSchema = SchemaFactory.createForClass(Household);
