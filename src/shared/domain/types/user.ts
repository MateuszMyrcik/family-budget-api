import { USER_ROLES } from '../constants';
import { UniqueId } from '../../commonTypes';
import { Household } from './household';

export type UserRole = typeof USER_ROLES[number];

export type User = {
  _id: UniqueId;
  email: string;
  nickname?: string;
  name?: string;
  surname?: string;
  createdAt: Date;
  household?: Household;
  isInvitePending: boolean;
  groupId?: UniqueId;
  avatarUrl?: string;
  role: UserRole;
};

export type GetUserInfoResponse = Pick<
  User,
  'email' | 'household' | 'isInvitePending' | 'role'
> & { id: UniqueId };

export type GetUserProfileResponse = Omit<User, 'createdAt'>;
