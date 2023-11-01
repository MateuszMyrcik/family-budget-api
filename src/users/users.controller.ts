import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { UniqueId } from 'src/shared';
import { DeleteResult } from 'mongodb';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UniqueId) {
    return this.usersService.findOne(id);
  }

  @Delete()
  deleteAll(): Promise<DeleteResult> {
    return this.usersService.deleteAll();
  }
}
