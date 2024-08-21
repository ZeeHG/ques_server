import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatedUserDto } from 'src/user/Dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() userInfo: CreatedUserDto) {
    const { username, password } = userInfo;
    return await this.authService.signIn(username, password);
  }
}
