import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }

  async register(registerUserDto: RegisterUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: registerUserDto.username,
      },
    });

    if (foundUser) {
      throw new BadRequestException('用户名已存在');
    }

    try {
      await this.prisma.user.create({
        data: {
          username: registerUserDto.username,
          nickName: registerUserDto.nickName,
          password: registerUserDto.password,
        },
      });
      return '注册成功';
    } catch (e) {
      return '注册失败';
    }
  }

  async login(loginUser: LoginUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: loginUser.username,
      },
    });

    if (!foundUser || foundUser.password !== loginUser.password) {
      throw new BadRequestException('用户名或密码错误');
    }

    delete foundUser.password;
    return foundUser;
  }

  async info(id: number) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        headPic: true,
        createTime: true,
        updateTime: true,
      },
    });

    return foundUser;
  }

  async getFriendship(id: number) {
    const friends = await this.prisma.friendship.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
      },
    });

    const set = new Set<number>()
    for (let i = 0; i < friends.length; ++i) {
      set.add(friends[i].userId)
      set.add(friends[i].friendId)
    }

    const friendIds = [...set].filter(item => item !== id)

    const res = []
    for (let i = 0; i < friendIds.length; ++i) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: friendIds[i]
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          headPic: true,
          createTime: true,
          updateTime: true
        }
      })
      res.push(user)
    }

    return res
  }
}
