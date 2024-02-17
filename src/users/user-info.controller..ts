import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/common/user.decorator';
import { UserRequestInfo } from 'src/common/user.type';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-info')
@UseGuards(AuthGuard('jwt'))
export class UserInfoController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findOne(@User() { id }: UserRequestInfo) {
    return this.usersService.findUser(id);
  }
}
