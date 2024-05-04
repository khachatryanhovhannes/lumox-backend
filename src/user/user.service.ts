import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getMe(user: User) {
    return user;
  }

  async editMe(changeData, user: User) {
    if (changeData) {
      const updatedUser = await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          firstname: changeData.firstname,
          lastname: changeData.lastname,
        },
      });

      delete updatedUser.password;
      return updatedUser;
    } else {
      return {
        message: 'User not found',
      };
    }
  }

  async deleteMe(user: User) {
    return await this.prisma.user.delete({
      where: {
        email: user.email,
      },
    });
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (user) {
      delete user.password;
      return user;
    }
    return {
      message: 'User not found',
    };
  }

  async getUsers(orderBy: string, limit: number) {
    const usersWithPostCount = await this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });

    const usersWithPostCountAndCount = usersWithPostCount.map((user) => ({
      ...user,
      postCount: user.posts.length,
    }));

    const sortedUsers = usersWithPostCountAndCount.sort((a, b) => {
      if (orderBy === 'asc') {
        return a.postCount - b.postCount;
      } else {
        return b.postCount - a.postCount;
      }
    });
    const limitedUsers = sortedUsers.slice(0, limit);

    return limitedUsers;
  }
}
