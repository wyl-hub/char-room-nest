import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/custom.decorate';

@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser)
    return {
      user,
      token: this.jwtService.sign({
        id: user.id,
        username: user.username
      }, {
        expiresIn: '1d'
      })
    }
  }

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('id') id: number) {
    return await this.userService.info(id)
  }

  @Post('friendship')
  @RequireLogin()
  async friendship(@UserInfo('id') id: number) {
    return this.userService.getFriendship(id)
  }
}
