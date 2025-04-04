import { Controller, Get, Param, Query } from '@nestjs/common';
import { StringExpression } from 'mongoose';
import { StatService } from './stat.service';
import { query } from 'express';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get(':questionId')
  async getQuestionStat(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.statService.getQuestionStatListAndCount(questionId, {
      page,
      size: pageSize,
    });
  }

  @Get(':questionId/:componentFeId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string,
  ) {
    return await this.statService.getComponentStatListAndCount(
      questionId,
      componentFeId,
    );
  }
}
