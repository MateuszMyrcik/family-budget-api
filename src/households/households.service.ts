import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Household, HouseholdDocument } from './schemas/household.schema';
import { Model } from 'mongoose';
import { UniqueId } from 'src/shared';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { UsersService } from 'src/users/users.service';
import { ClassificationsService } from 'src/classifications/classifications.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { BudgetsService } from 'src/budgets/budgets.service';

@Injectable()
export class HouseholdsService {
  constructor(
    @InjectModel(Household.name)
    @InjectModel('Household')
    private householdModel: Model<HouseholdDocument>,
    private userService: UsersService,
    @Inject(forwardRef(() => ClassificationsService))
    private classificationService: ClassificationsService,
    @Inject(forwardRef(() => TransactionsService))
    private transactionsService: TransactionsService,
    @Inject(forwardRef(() => BudgetsService))
    private budgetsService: BudgetsService,
  ) {}

  async create(ownerId: UniqueId) {
    if (await this.findOne(ownerId)) {
      throw new BadRequestException('User already has a household');
    }

    const createHouseholdDto = {
      owner: ownerId,
      members: [ownerId],
    };

    const createdHousehold = new this.householdModel(createHouseholdDto);

    await this.userService.updateHousehold(ownerId, createdHousehold._id);
    await this.classificationService.createDefaultClassification(
      createdHousehold._id,
    );

    return createdHousehold.save();
  }

  async findAll() {
    const households = await this.householdModel.find().exec();

    const populatedHouseholds = await Promise.all(
      households.map((household) =>
        household.populate(['owner', 'pendingInvites.sender', 'members']),
      ),
    );

    return populatedHouseholds;
  }

  async findOne(id: UniqueId): Promise<HouseholdDocument> {
    const household = await this.findAll().then((households) =>
      households.find((household) =>
        household.members.some((member) => member._id === id),
      ),
    );

    return household;
  }

  async findOneWithValidation(id: UniqueId): Promise<HouseholdDocument> {
    const household = await this.findOne(id);

    if (!household) {
      throw new BadRequestException('Household does not exist');
    }

    return household;
  }

  async getHouseholdIdByUserId(userId: UniqueId): Promise<ObjectId> {
    const household = await this.findOne(userId);

    if (!household) {
      throw new BadRequestException('Household does not exist');
    }

    return household._id;
  }

  async update(
    id: UniqueId,
    updateHouseholdDto: UpdateHouseholdDto,
  ): Promise<UpdateResult> {
    return this.householdModel.updateOne(updateHouseholdDto);
  }

  async removeHousehold(userId: UniqueId): Promise<DeleteResult> {
    const household = await this.householdModel.findOne({ owner: userId });

    if (!household) {
      throw new BadRequestException('Household does not exist');
    }

    await this.classificationService.deleteHouseholdClassificationRecords(
      household._id,
    );
    await this.transactionsService.deleteHouseholdTransactions(userId);
    await this.budgetsService.deleteHouseholdBudget(userId);

    return this.householdModel.deleteOne({ owner: userId });
  }

  async sendInvite(userId: UniqueId, ownerEmail: UniqueId) {
    const households = await this.findAll();

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

  async removePendingInvite(
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

  async declineInvite(userId: UniqueId, inviteId: UniqueId) {
    const household = await this.findOne(userId);

    await this.validateUserIsOwner(userId);

    if (!household.pendingInvites.find((invite) => invite._id === inviteId)) {
      throw new BadRequestException('Invite does not exist');
    }

    const sender = household.pendingInvites.find(
      (invite) => invite._id === inviteId,
    ).sender;

    await this.removePendingInvite(inviteId, household._id);
    await this.userService.updateInviteStatus(sender._id, false);

    return this.householdModel.findById(household._id);
  }

  async acceptInvite(userId: UniqueId, inviteId: UniqueId) {
    const household = await this.findOne(userId);

    await this.validateUserIsOwner(userId);

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

    await this.removePendingInvite(inviteId, household._id);

    return this.householdModel.findById(household._id);
  }

  async removeMember(userId: UniqueId, memberId: UniqueId) {
    const household = await this.findOne(userId);

    await this.validateUserIsOwner(userId);

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

  private async validateUserIsOwner(userId: UniqueId) {
    const household = await this.findOne(userId);

    if (household.owner._id !== userId) {
      throw new BadRequestException('User is not owner of household');
    }

    return household;
  }
}
