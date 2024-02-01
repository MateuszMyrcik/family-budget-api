import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UniqueId, GetUserInfoResponse, USER_ROLE } from 'src/shared';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.userModel.exists({ _id: createUserDto._id });

    if (userExist) {
      throw new ConflictException('User already exist!');
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(userId: UniqueId): Promise<GetUserInfoResponse> {
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'household',
        populate: {
          path: 'owner',
          model: 'User',
        },
      })
      .populate({
        path: 'household',
        populate: {
          path: 'pendingInvites.sender',
          model: 'User',
        },
      })
      .populate({
        path: 'household',
        populate: {
          path: 'members',
          model: 'User',
        },
      })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const { email, household, isInvitePending } = user.toObject({
      versionKey: false,
    });

    const hasHousehold = !!household;

    const role = hasHousehold
      ? (household.owner as any)._id === userId
        ? USER_ROLE.OWNER
        : USER_ROLE.MEMBER
      : USER_ROLE.GUEST;

    return {
      id: userId,
      role,
      email,
      household,
      isInvitePending,
    };
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async updateHousehold(
    userId: UniqueId,
    householdId: ObjectId,
  ): Promise<UpdateResult> {
    return this.userModel
      .findById(userId)
      .updateOne({ household: householdId })
      .exec();
  }

  async updateInviteStatus(
    userId: UniqueId,
    isInvitePending: boolean,
  ): Promise<UpdateResult> {
    return this.userModel
      .findById(userId)
      .updateOne({ isInvitePending })
      .exec();
  }

  deleteAll(): Promise<DeleteResult> {
    return this.userModel.deleteMany({}).exec();
  }
}
