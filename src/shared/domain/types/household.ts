import { User } from './user';
import { UniqueId } from '../../commonTypes';

export type Household = {
  name: string;
  members: User[];
  createdAt: Date;
  owner: User;
  pendingInvites: Invite[];
};

export type Invite = {
  _id: UniqueId;
  sender: User;
  createdAt: Date;
};

export type GetHouseholdResponse = Household;
