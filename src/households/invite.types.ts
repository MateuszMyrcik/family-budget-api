import { User } from 'src/users/schemas/user.schema';

export type Invite = {
  sender: User;
  createdAt: Date;
};
