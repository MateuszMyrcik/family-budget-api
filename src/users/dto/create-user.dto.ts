import { UniqueId } from 'src/domain-types/shared';

export class CreateUserDto {
  readonly id: UniqueId;

  readonly nickname: string;

  readonly name: string;

  readonly surname: string;

  readonly email: string;

  readonly avatarUrl?: string;
}
