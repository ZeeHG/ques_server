import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Delete,
  Param,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Request() req) {
    const { username } = req.user;
    return this.questionService.create(username);
  }

  @Get() findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('size') pageSize: number,
  ) {
    const list = this.questionService.findAllList({ keyword, page, pageSize });
    const count = this.questionService.countAll({ keyword });
    return { list, count };
  }
  @Get('id') findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch('id') updateOne(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
  ) {
    return this.questionService.update(id, questionDto);
  }
  @Delete('id') deleteOne(@Param('id') id: string) {
    return this.questionService.delete(id);
  }
}
