import { Controller, Get } from '@nestjs/common';
import { count } from 'console';

@Controller('question')
export class QuestionController {
  @Get() findAll() {
    return { list: ['a', 'b', 'c'], count: 10 };
  }
}
