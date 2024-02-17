import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { HouseholdsService } from './households.service';

import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/user.decorator';
import { UserRequestInfo } from 'src/common/user.type';
import { UniqueId, GetUserInfoResponse } from 'src/shared';

@Controller('households')
@UseGuards(AuthGuard('jwt'))
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}

  @Post()
  createHousehold(@User() { id }: UserRequestInfo) {
    return this.householdsService.createHousehold(id);
  }

  @Get()
  findHousehold(@User() { id }: UserRequestInfo) {
    return this.householdsService.findHousehold(id);
  }

  @Delete()
  deleteHousehold(@User() { id }: UserRequestInfo) {
    return this.householdsService.deleteHousehold(id);
  }

  @Delete('members/:memberId')
  deleteHouseholdMember(
    @User() { id }: GetUserInfoResponse,
    @Param('memberId') memberId: UniqueId,
  ) {
    return this.householdsService.deleteHouseholdMember(id, memberId);
  }

  @Post('invites/:ownerEmail')
  sendHouseholdInvite(
    @User() { id }: GetUserInfoResponse,
    @Param('ownerEmail') ownerEmail: string,
  ) {
    return this.householdsService.sendHouseholdInvite(id, ownerEmail);
  }

  @Post('invites/accept/:inviteId')
  acceptHouseholdInvite(
    @User() { id }: GetUserInfoResponse,
    @Param('inviteId') inviteId: UniqueId,
  ) {
    return this.householdsService.acceptHouseholdInvite(id, inviteId);
  }

  @Delete('invites/decline/:inviteId')
  declineHouseholdInvite(
    @User() { id }: GetUserInfoResponse,
    @Param('inviteId') inviteId: UniqueId,
  ) {
    return this.householdsService.declineHouseholdInvite(id, inviteId);
  }
}
