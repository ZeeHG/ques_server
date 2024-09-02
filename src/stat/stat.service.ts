import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}
  private genAnswersInfo(question, answerList = []) {
    const res = {};
    const { componentList = [] } = question;
    answerList.forEach((a) => {
      const { componentFeId, value = [] } = a;

      const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
      const { type, props = {} } = comp;
      if (type === 'questionRadio') {
        // 单选
        res[componentFeId] = value
          .map((v) => this._getRadio0ptText(v, props))
          .toString();
      } else if (type === 'questionCheckbox') {
        res[componentFeId] = value
          .map((v) => this._getcheckboxOptText(v, props))
          .tostring();
      } else {
        // 其他
        res[componentFeId] = value.toString();
      }
    });
  }
  async getQuestionStatListAndCount(
    questionId: string,
    opt: { page: number; size: number },
  ) {
    const noData = { list: [], count: 0 };
    if (!questionId) return noData;
    const q = await this.questionService.findOne(questionId);
    if (q == null) return noData;
    const total = await this.answerService.count(questionId);
    if (total === 0) return noData;
    const answers = await this.answerService.findAll(questionId, opt);
    const list = answers.map((a) => {
      return {
        id: a._id,
        ...this.genAnswersInfo(q, a.answerList),
      };
    });

    return { list, total };
  }
}
