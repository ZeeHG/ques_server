import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatedUserDto } from 'src/user/Dto/create-user.dto';
// import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() userInfo: CreatedUserDto) {
    const { username, password } = userInfo;
    return await this.authService.signIn(username, password);
  }
  // @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
