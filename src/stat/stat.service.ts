import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  private _getRadioOptText(value: string, props: any): string {
    const { options = [] } = props;
    const length = options.length;
    for (let i = 0; i < length; i++) {
      const opt = options[i];
      if (opt.value === value) {
        return opt.text;
      }
    }
    return '';
  }

  private _getCheckboxOptText(value: string, props: any): string {
    const { options = [] } = props;
    const length = options.length;
    for (let i = 0; i < length; i++) {
      const opt = options[i];
      if (opt.value === value) {
        return opt.text;
      }
    }
    return '';
  }

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
          .map((v) => this._getRadioOptText(v, props))
          .toString();
      } else if (type === 'questionCheckbox') {
        res[componentFeId] = value
          .map((v) => this._getCheckboxOptText(v, props))
          .toString();
      } else {
        // 其他
        res[componentFeId] = value.toString();
      }
    });
    return res;
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

  async getComponentStatListAndCount(
    questionId: string,
    componentFeId: string,
  ) {
    if (!questionId || !componentFeId) return [];

    const q = await this.questionService.findOne(questionId);
    if (q == null) return [];

    const { componentList = [] } = q;
    const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
    if (comp == null) return [];

    const { type, props = {} } = comp;
    if (type === 'questionRadio' || type === 'questionCheckbox') {
      return [];
    }

    const total = await this.answerService.count(questionId);
    if (total === 0) return [];
    const answers = await this.answerService.findAll(questionId, {
      page: 1,
      size: total,
    });
    const countInfo = {};
    answers.forEach((a) => {
      const { answerList = [] } = a;
      answerList.forEach((a) => {
        if (a.componentFeId == componentFeId) return;
        a.value.forEach((v) => {
          if (countInfo[v] == null) {
            countInfo[v] = 0;
          }
          countInfo[v]++;
        });
      });
    });
    const list = [];
    for (const val in countInfo) {
      let text = '';
      if (type === 'questionRadio') {
        text = this._getRadioOptText(val, props);
      } else if (type === 'questionCheckbox') {
        text = this._getCheckboxOptText(val, props);
      }
      list.push({
        text,
        count: countInfo[val],
      });
    }
    return list;
  }
}
