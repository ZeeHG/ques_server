import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { Injector } from '@nestjs/core/injector/injector';
import { nanoid } from 'nanoid';
import { title } from 'process';
import mongoose from 'mongoose';
@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private readonly questionModel) {}
  async create(username: string) {
    const question = new this.questionModel({
      title: 'title' + Date.now(),
      desc: 'desc',
      author: username,
      componentList: [
        {
          fe_id: nanoid(),
          type: 'QuestionInfo',
          title: 'Info',
          props: { title: 'title', desc: 'description' },
        },
      ],
    });
    return await question.save();
  }
  async delete(id: string, author: string) {
    // return await this.questionModel.findByIdAndDelete(id);
    const res = await this.questionModel.findOneAndDelete({ _id: id, author });
    return res;
  }

  async deleteMany(ids: string[], author: string) {
    const res = await this.questionModel.deleteMany({
      id: { $in: ids },
      author,
    });
    return res;
  }
  async update(id: string, updateData, author) {
    return await this.questionModel.updateOne({ _id: id, author }, updateData);
  }
  async findOne(id: string) {
    return await this.questionModel.findById(id);
  }
  async findAllList({
    keyword = '',
    page = 1,
    pageSize = 10,
    isDeleted = false,
    isStar,
    author = '',
  }) {
    const whereOpt: any = { author, isDeleted };
    if (isStar != null) whereOpt.isStar = isStar;
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; //模糊搜索
    }
    return await this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 })
      .skip(page - 1 * pageSize)
      .limit(pageSize);
  }

  async countAll({ keyword = '', isDeleted = false, isStar, author = '' }) {
    const whereOpt: any = { author, isDeleted };
    if (isStar != null) whereOpt.isStar = isStar;
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; //模糊搜索
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg };
    }
    return await this.questionModel.countDocuments(whereOpt);
  }

  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id);
    const newQuestion = new this.questionModel({
      ...question.toObject,
      id: new mongoose.Types.ObjectId(),
      title: question.title + '副本',
      author,
      isPublished: false,
      isStar: false,
      componentList: question.componentList.map((item) => {
        return { ...item, fe_id: nanoid() };
      }),
    });
    return await newQuestion.save();
  }
}
