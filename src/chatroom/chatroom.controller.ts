import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/custom.decorate';
import { ChatroomUserDto } from './dto/chatroom-user.dto';

@Controller('chatroom')
@RequireLogin()
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post('create-single')
  async createSingle(@Body('id') friendId: number, @UserInfo('id') id: number) {
    if (!friendId) {
      throw new BadRequestException('聊天对象不能为空')
    }
    return this.chatroomService.createSingle(friendId, id)
  }

  @Post('create-group')
  async createGroup(@Body('name') name: string, @UserInfo('id') id: number) {
    return this.chatroomService.createGroup(name, id)
  }

  // 查群聊接口
  @Post('list')
  async list(@UserInfo('id') id: number) {
    return await this.chatroomService.list(id)
  }

  // 查询群聊成员
  @Post('member')
  async member(@Body('chatroomId') chatroomId: number) {
    return this.chatroomService.member(chatroomId)
  }

  @Post('join')
  async join(@Body()chatroomUser: ChatroomUserDto) {
    return await this.chatroomService.join(chatroomUser)
  }

  @Post('exit')
  async exit(@Body()chatroomUser: ChatroomUserDto) {
    return await this.chatroomService.exit(chatroomUser)
  }
}
