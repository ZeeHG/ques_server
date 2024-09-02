import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schema/answer.schema';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private readonly answerModel) {}

  async create(answerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷Id', HttpStatus.BAD_REQUEST);
    }
    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }

  async count(questionId: string) {
    if (!questionId) return 0;
    return await this.answerModel.count({ questionId });
  }
  async findAll(questionId: string, opt: { page: number; pagesize: number }) {
    if (!questionId) return [];
    const { page = 1, pagesize = 10 } = opt;
    const list = await this.answerModel
      .find({ questionId })
      .skip((page - 1) * pagesize)
      .limit(pagesize)
      .sort({ createdAt: -1 });
    return list;
  }
}
