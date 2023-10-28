import { USER_ROLES } from '../constants';
import { UniqueId } from '../../commonTypes';

export type UserRole = typeof USER_ROLES[number];

export type User = {
  id: UniqueId;
  email: string;
  nickname?: string;
  name?: string;
  surname?: string;
  createdAt: Date;
  groupId?: UniqueId;
  avatarUrl?: string;
  role?: UserRole;
};

export type UserInfoResponse = Pick<User, 'id' | 'email' | 'groupId'>;
export type UserProfileResponse = Omit<User, 'createdAt'>;
