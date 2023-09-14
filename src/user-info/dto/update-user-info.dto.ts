import { PartialType } from '@nestjs/mapped-types';
import { EditUserInfoDto } from './edit-user-info.dto';

export class UpdateUserInfoDto extends PartialType(EditUserInfoDto) {}
