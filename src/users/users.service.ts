import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UniqueId, UserInfoResponse } from 'src/shared';
import { DeleteResult } from 'mongodb';

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

  async findOne(id: UniqueId): Promise<UserInfoResponse> {
    const user = await this.userModel.findOne({ id }).exec();

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, groupId } = user.toObject({
      versionKey: false,
    });

    return {
      id,
      email,
      groupId: groupId || null,
    };
  }

  findAll() {
    return this.userModel.find().exec();
  }

  update(id: UniqueId, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  deleteAll(): Promise<DeleteResult> {
    return this.userModel.deleteMany({}).exec();
  }
}
