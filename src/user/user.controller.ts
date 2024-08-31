import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreatedUserDto } from './Dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: CreatedUserDto) {
    try {
      return await this.userService.create(userDto);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('info')
  @Redirect('/api/auth/profile', 302)
  async info() {
    return 'info';
  }
  @Post('login')
  @Redirect('/api/auth/login', 307) // http 状态码，POST 请求-308 永久，307 临时
  async login() {
    return;
  }
  @Get() findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('size') pageSize: number,
  ) {
    const list = this.userService.findAllList({ keyword, page, pageSize });
    const count = this.userService.countAll({ keyword });
    return { list, count };
  }
  //   @Get('id') findOne(@Param('id') id: string) {
  //     return this.userService.findOne(id);
  //   }

  @Patch('id') updateOne(
    @Param('id') id: string,
    @Body() questionDto: CreatedUserDto,
  ) {
    return this.userService.update(id, questionDto);
  }
  @Delete('id') deleteOne(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
