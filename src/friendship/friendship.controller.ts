import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/custom.decorate';
import { FriendAddDto } from './dto/friend-add.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('add')
  @RequireLogin()
  async add(@Body() friendAddDto: FriendAddDto, @UserInfo('id') id: number) {
    return await this.friendshipService.add(friendAddDto, id)
  }

  @Get('agree/:id')
  @RequireLogin()
  async agree(@Param('id') friendId: number, @UserInfo('id') id: number) {
    if (!friendId) {
      throw new BadRequestException('处理的请求id为空')
    }
    return this.friendshipService.agree(friendId, id)
  }

  @Get('reject/:id')
  @RequireLogin()
  async reject(@Param('id') friendId: number, @UserInfo('id') id: number) {
    if (!friendId) {
      throw new BadRequestException('处理的请求id为空')
    }
    return this.friendshipService.reject(friendId, id)
  }

  @Get('remove/:id')
  @RequireLogin()
  async remove(@Param('id') friendId: number, @UserInfo('id') id: number) {
    return this.friendshipService.remove(friendId, id)
  }
}
