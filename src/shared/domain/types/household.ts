import { User } from './user';

export type Household = {
  name: string;
  members: User[];
  createdAt: Date;
  owner: User;
  pendingInvites: Invite[];
};

export type Invite = {
  sender: User;
  createdAt: Date;
};

export type GetHouseholdResponse = Household;
