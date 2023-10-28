import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/transactions/user.decorator';
import { UserRequestInfo } from 'src/transactions/user.type';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-info')
@UseGuards(AuthGuard('jwt'))
export class UserInfoController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findOne(@User() { id }: UserRequestInfo) {
    return this.usersService.findOne(id);
  }

  @Post()
  update(
    @User() { id }: UserRequestInfo,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.update(id, createUserDto);
  }
}
