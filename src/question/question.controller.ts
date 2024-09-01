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
    @Query('isDeleted') isDeleted: boolean = false,
    @Query('isStar') isStar: boolean = false,
    @Request() req,
  ) {
    const { username } = req.user;
    const list = this.questionService.findAllList({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author: username,
    });
    const count = this.questionService.countAll({
      keyword,
      isDeleted,
      isStar,
      author: username,
    });
    return { list, count };
  }
  @Get('id') findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch('id') updateOne(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
    @Request() req,
  ) {
    const { username } = req.user;
    return this.questionService.update(id, questionDto, username);
  }
  @Delete('id') deleteOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.questionService.delete(id, username);
  }
  @Delete('id') deleteMany(@Body() body, @Request() req) {
    const { username } = req.user;
    const { ids = [] } = body;
    return this.questionService.deleteMany(ids, username);
  }
  @Post('duplicate/;id')
  duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.questionService.duplicate(id, username);
  }
}
