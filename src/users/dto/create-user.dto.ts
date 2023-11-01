import { UniqueId } from 'src/shared';

export class CreateUserDto {
  readonly _id: UniqueId;

  readonly nickname: string;

  readonly name: string;

  readonly surname: string;

  readonly email: string;

  readonly avatarUrl?: string;
}
