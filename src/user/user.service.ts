import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreatedUserDto } from './Dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel) {}
  async create(userData: CreatedUserDto) {
    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }
  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
  async update(id: string, updateData) {
    return await this.userModel.updateOne({ _id: id }, updateData);
  }
  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
  async findAllList({ keyword = '', page = 1, pageSize = 10 }) {
    const whereOpt: any = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; //模糊搜索
    }
    return await this.userModel
      .find(whereOpt)
      .sort({ _id: -1 })
      .skip(page - 1 * pageSize)
      .limit(pageSize);
  }

  async countAll({ keyword = '' }) {
    const whereOpt: any = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg };
    }
    return await this.userModel.countDocuments(whereOpt);
  }
}
