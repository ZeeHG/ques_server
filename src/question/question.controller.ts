import { Controller, Get, Patch, Query } from '@nestjs/common';
import { count } from 'console';

@Controller('question')
export class QuestionController {
  @Get() findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return { list: ['a', 'b', 'c'], count: 10 };
  }
  @Get('id') findOne(@Param('id') id: string) {
    return { id, title: 'aaa', desc: 'bbb' };
  }
  @Patch('id') updateOne(@Param('id') id: string) {
    return { id, title: 'aaa', desc: 'bbb' };
  }
}
