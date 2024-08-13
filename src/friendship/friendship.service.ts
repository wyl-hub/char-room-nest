import { Inject, Injectable } from '@nestjs/common';
import { FriendAddDto } from './dto/friend-add.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prisma: PrismaService

  async add(friendAddDto: FriendAddDto, id: number) {
    try {
      await this.prisma.friendRequest.create({
        data: {
          fromUserId: id,
          toUserId: friendAddDto.friendId,
          reason: friendAddDto.reason,
          status: 0
        }
      })
      return '发送请求成功'
    } catch(e) {
      return '发送请求失败'
    }
  }

  async agree(friendId: number, id: number) {
    await this.prisma.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: id,
        status: 0
      },
      data: {
        status: 1
      }
    })

    const res = await this.prisma.friendship.findMany({
      where: {
        userId: id,
        friendId: id
      }
    })

    if (!res.length) {
      await this.prisma.friendship.create({
        data: {
          userId: id,
          friendId: friendId
        }
      })
    }

    return '添加成功'
  }

  async reject(friendId: number, id: number) {
    await this.prisma.friendRequest.updateMany({
      where: {
        toUserId: id,
        fromUserId: friendId,
        status: 0
      },
      data: {
        status: 2
      }
    })

    return '已拒绝'
  }
  
  async remove(friendId: number, id: number) {
    // userId friendId 互换  测试
    await this.prisma.friendship.deleteMany({
      where: {
        userId: id,
        friendId: friendId
      }
    })

    return '删除成功'
  }
}