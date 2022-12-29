import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import { UniqueId } from 'src/domain-types/shared';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createCatDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createCatDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: UniqueId): Promise<User> {
    return this.userModel.findOne({ _id: id });
  }

  async update(
    id: UniqueId,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userModel.updateOne(updateUserDto);
  }

  async remove(id: UniqueId): Promise<DeleteResult> {
    return this.userModel.deleteOne({ _id: id });
  }
}
