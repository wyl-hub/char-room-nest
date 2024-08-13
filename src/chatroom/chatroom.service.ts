import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatroomUserDto } from './dto/chatroom-user.dto';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async createSingle(friendId: number, id: number) {
    const { id: chatroomId } = await this.prisma.chatroom.create({
      data: {
        name: `聊天室${id}${friendId}` + Math.random().toString().slice(2, 8),
        type: false,
      },
      select: {
        id: true,
      },
    });

    await this.prisma.userChatroom.create({
      data: {
        chatroomId,
        userId: id,
      },
    });

    await this.prisma.userChatroom.create({
      data: {
        chatroomId,
        userId: friendId,
      },
    });

    return '创建成功';
  }

  async createGroup(name: string, id: number) {
    const { id: chatroomId } = await this.prisma.chatroom.create({
      data: {
        name,
        type: true,
      },
    });
    await this.prisma.userChatroom.create({
      data: {
        chatroomId,
        userId: id,
      },
    });
    return '创建成功';
  }

  async list(id: number) {
    const roomIds = await this.prisma.userChatroom.findMany({
      where: {
        userId: id
      },
      select: {
        chatroomId: true
      }
    })

    const chatRooms = await this.prisma.chatroom.findMany({
      where: {
        id: {
          in: roomIds.map(item => item.chatroomId)
        },
        type: true
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true
      }
    })

    return chatRooms
  }

  async member(chatroomId: number) {
    const userIds = await this.prisma.userChatroom.findMany({
      where: {
        chatroomId
      },
      select: {
        userId: true
      }
    })

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds.map(item => item.userId)
        }
      },
      select: {
        id: true,
        nickName: true,
        username: true,
        headPic: true,
        createTime: true,
        updateTime: true
      }
    })

    return users
  }

  async join(chatroomUser: ChatroomUserDto) {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        id: chatroomUser.chatroomId
      }
    })

    if (!chatroom.type) {
      throw new BadRequestException('私聊无法加入')
    }

    await this.prisma.userChatroom.create({
      data: {
        chatroomId: chatroom.id,
        userId: chatroomUser.userId
      }
    })

    return '加入成功'
  }

  async exit(chatroomUser: ChatroomUserDto) {
    const chatroom = await this.prisma.chatroom.findUnique({
      where: {
        id: chatroomUser.chatroomId
      }
    })

    if (!chatroom.type) {
      throw new BadRequestException('私聊无法退出')
    }

    await this.prisma.userChatroom.deleteMany({
      where: {
        chatroomId: chatroom.id,
        userId: chatroomUser.userId
      }
    })

    return '加入成功'
  }
}
