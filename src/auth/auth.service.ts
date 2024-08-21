import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, password);
    if (!user) throw new UnauthorizedException('用户名或密码错误');
    const { password: p, ...userInfo } = user.toObject();
    return userInfo;
  }
}
