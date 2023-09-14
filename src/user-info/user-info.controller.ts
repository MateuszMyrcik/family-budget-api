import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserInfoService } from './user-info.service';
import { EditUserInfoDto } from './dto/edit-user-info.dto';
import { User } from 'src/transactions/user.decorator';
import { UserRequestInfo } from 'src/transactions/user.type';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  find(@User() { id }: UserRequestInfo) {
    return this.userInfoService.find(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  edit(@Body() editUserInfoDto: EditUserInfoDto) {
    return this.userInfoService.edit(editUserInfoDto);
  }

  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // create(@Body() userInfo: EditUserInfoDto) {
  //   return this.userInfoService.create(userInfo);
  // }
}
