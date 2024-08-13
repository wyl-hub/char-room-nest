import { IsNotEmpty } from 'class-validator';

export class ChatroomUserDto {
  @IsNotEmpty({
    message: '聊天室id不能为空',
  })
  chatroomId: number;

  @IsNotEmpty({
    message: '用户id不能为空',
  })
  userId: number;
}
