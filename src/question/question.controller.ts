import { Body, Controller, Get, Patch, Query,Param,HttpException,HttpStatus } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
  @Get() findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return { list: ['a', 'b', 'c'], count: 10  };
  }
  @Get('id') findOne(@Param('id') id: string) {
    return { id, title: 'aaa', desc: 'bbb' };
  }
  @Patch('id') updateOne(@Param('id') id: string, @Body()questionDto:QuestionDto) {
    return { id, title: 'aaa', desc: 'bbb' };
  }
}
