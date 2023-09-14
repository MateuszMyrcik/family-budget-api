import { UserInfo, UserInfoDocument } from './schemas/user-info.schema';
import { Injectable } from '@nestjs/common';

import { UniqueId } from 'src/domain-types/shared';
import { EditUserInfoDto } from './dto/edit-user-info.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateResult } from 'mongodb';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectModel(UserInfo.name)
    @InjectModel('Transaction')
    private userInfo: Model<UserInfoDocument>,
  ) {}

  async edit(editUserInfo: EditUserInfoDto): Promise<UpdateResult> {
    return await this.userInfo.updateOne(editUserInfo);
  }

  async find(id: UniqueId) {
    const findedUser = await this.userInfo.findOne({ id: id });

    return findedUser;
  }

  async create(userInfo: UserInfo) {
    const createdUser = new this.userInfo(userInfo);
    return createdUser.save();
  }
}
