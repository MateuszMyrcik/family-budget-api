import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { HouseholdsService } from './households.service';

import { UpdateHouseholdDto } from './dto/update-household.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/user.decorator';
import { UserRequestInfo } from 'src/common/user.type';
import { UniqueId, GetUserInfoResponse } from 'src/shared';

@Controller('households')
@UseGuards(AuthGuard('jwt'))
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}

  @Post()
  create(@User() { id }: UserRequestInfo) {
    return this.householdsService.create(id);
  }

  @Get()
  findOne(@User() { id }: UserRequestInfo) {
    return this.householdsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHouseholdDto: UpdateHouseholdDto,
  ) {
    return this.householdsService.update(id, updateHouseholdDto);
  }

  @Delete()
  remove(@User() { id }: UserRequestInfo) {
    return this.householdsService.removeHousehold(id);
  }

  @Delete('members/:memberId')
  removeMember(
    @User() { id }: GetUserInfoResponse,
    @Param('memberId') memberId: UniqueId,
  ) {
    return this.householdsService.removeMember(id, memberId);
  }

  @Post('invites/:ownerEmail')
  invite(
    @User() { id }: GetUserInfoResponse,
    @Param('ownerEmail') ownerEmail: string,
  ) {
    return this.householdsService.sendInvite(id, ownerEmail);
  }

  @Post('invites/accept/:inviteId')
  acceptInvite(
    @User() { id }: GetUserInfoResponse,
    @Param('inviteId') inviteId: UniqueId,
  ) {
    return this.householdsService.acceptInvite(id, inviteId);
  }

  @Delete('invites/decline/:inviteId')
  declineInvite(
    @User() { id }: GetUserInfoResponse,
    @Param('inviteId') inviteId: UniqueId,
  ) {
    return this.householdsService.declineInvite(id, inviteId);
  }
}
