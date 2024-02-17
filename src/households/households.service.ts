import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Household, HouseholdDocument } from './schemas/household.schema';
import { Model } from 'mongoose';
import { UniqueId } from 'src/shared';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { UsersService } from 'src/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class HouseholdsService {
  constructor(
    @InjectModel(Household.name)
    @InjectModel('Household')
    private householdModel: Model<HouseholdDocument>,
    private userService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createHousehold(ownerId: UniqueId) {
    if (await this.findHousehold(ownerId)) {
      throw new BadRequestException('User already has a household');
    }

    const createHouseholdDto = {
      owner: ownerId,
      members: [ownerId],
    };

    const createdHousehold = new this.householdModel(createHouseholdDto);

    await this.userService.updateHousehold(ownerId, createdHousehold._id);
    this.eventEmitter.emit('household.created', createdHousehold._id);

    return createdHousehold.save();
  }

  async findAllHouseholds() {
    const households = await this.householdModel.find().exec();

    const populatedHouseholds = await Promise.all(
      households.map((household) =>
        household.populate(['owner', 'pendingInvites.sender', 'members']),
      ),
    );

    return populatedHouseholds;
  }

  async findHousehold(userId: UniqueId): Promise<HouseholdDocument> {
    const household = await this.findAllHouseholds().then((households) =>
      households.find((household) =>
        household.members.some((member) => member._id === userId),
      ),
    );

    return household;
  }

  async getHouseholdIdByUserId(userId: UniqueId): Promise<ObjectId> {
    const household = await this.findHousehold(userId);

    if (!household) {
      throw new BadRequestException('Household does not exist');
    }

    return household._id;
  }

  async deleteHousehold(userId: UniqueId): Promise<DeleteResult> {
    const household = await this.householdModel.findOne({ owner: userId });

    if (!household) {
      throw new BadRequestException('Household does not exist');
    }

    this.eventEmitter.emit('household.removed', household._id);

    return this.householdModel.deleteOne({ owner: userId });
  }

  async sendHouseholdInvite(userId: UniqueId, ownerEmail: UniqueId) {
    const households = await this.findAllHouseholds();

    const household = households.find(
      (household) => household.owner.email === ownerEmail,
    );

    if (!household) {
      throw new BadRequestException('Household does not exist');
    }

    if (household.members.some((member) => member._id === userId)) {
      throw new BadRequestException('User already in household');
    }

    if (
      household.pendingInvites.find((invite) => invite.sender._id === userId)
    ) {
      throw new BadRequestException('Invite already sent to household');
    }

    await this.householdModel.updateOne(
      { _id: household._id },
      {
        $push: {
          pendingInvites: {
            sender: userId,
            createdAt: new Date(),
            _id: new ObjectId(),
          },
        },
      },
    );

    await this.userService.updateInviteStatus(userId, true);

    return this.householdModel.findOne({ _id: household._id });
  }

  async deletePendingInvite(
    inviteId: UniqueId,
    householdId: ObjectId,
  ): Promise<UpdateResult> {
    try {
      const result = await this.householdModel.updateOne(
        { _id: householdId },
        {
          $pull: {
            pendingInvites: {
              _id: inviteId,
            },
          },
        },
      );

      // Check if the update operation had any effect
      if (result.modifiedCount === 0) {
        console.log(
          'No changes were made. Perhaps the inviteId was not found?',
          result,
        );
      }

      return result;
    } catch (error) {
      // Properly handle the error
      console.error('Error removing pending invite:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

  async declineHouseholdInvite(userId: UniqueId, inviteId: UniqueId) {
    const household = await this.findHousehold(userId);

    await this.checkUserOwnership(userId);

    if (!household.pendingInvites.find((invite) => invite._id === inviteId)) {
      throw new BadRequestException('Invite does not exist');
    }

    const sender = household.pendingInvites.find(
      (invite) => invite._id === inviteId,
    ).sender;

    await this.deletePendingInvite(inviteId, household._id);
    await this.userService.updateInviteStatus(sender._id, false);

    return this.householdModel.findById(household._id);
  }

  async acceptHouseholdInvite(userId: UniqueId, inviteId: UniqueId) {
    const household = await this.findHousehold(userId);

    await this.checkUserOwnership(userId);

    if (!household.pendingInvites.find((invite) => invite._id === inviteId)) {
      throw new BadRequestException('Invite does not exist');
    }

    const sender = household.pendingInvites.find(
      (invite) => invite._id === inviteId,
    ).sender;

    await this.householdModel.updateOne(
      { _id: household._id },
      {
        $push: {
          members: sender._id,
        },
      },
    );

    await this.userService.updateHousehold(sender._id, household._id);
    await this.userService.updateInviteStatus(sender._id, false);

    await this.deletePendingInvite(inviteId, household._id);

    return this.householdModel.findById(household._id);
  }

  async deleteHouseholdMember(userId: UniqueId, memberId: UniqueId) {
    const household = await this.findHousehold(userId);

    await this.checkUserOwnership(userId);

    if (!household.members.some((member) => member._id === memberId)) {
      throw new BadRequestException('Member does not exist');
    }

    if (household.owner._id === memberId) {
      throw new BadRequestException('Household owner cannot be removed');
    }

    await this.householdModel.updateOne(
      { _id: household._id },
      {
        $pull: {
          members: memberId,
        },
      },
    );

    await this.userService.updateHousehold(memberId, null);

    return this.householdModel.findById(household._id);
  }

  private async checkUserOwnership(userId: UniqueId) {
    const household = await this.findHousehold(userId);

    if (!household || household.owner._id !== userId) {
      throw new BadRequestException('User is not owner of household');
    }

    return household;
  }
}
