import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(user: User) {
    const fullUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
      include: {
        followers: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            // Exclude password field
          },
        },
        following: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        posts: true,
      },
    });

    delete fullUser.password;
    return fullUser;
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

  async addImage(user: User, path: string) {
    const newUser = await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        imagePath: path,
      },
    });

    delete newUser.password;

    return newUser;
  }

  async addBackgroundImage(user: User, path: string) {
    console.log(path, user);
    const newUser = await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        backgroundImagePath: path,
      },
    });

    delete newUser.password;

    return newUser;
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
      include: {
        followers: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        following: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        posts: true,
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

  async followUser(user: User, userId: number) {
    const followerUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    const followedUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!followerUser || !followedUser) {
      throw new NotFoundException('User not found.');
    }

    // Check if the follower is trying to follow themselves
    if (followerUser.id === followedUser.id) {
      throw new Error('Cannot follow yourself.');
    }

    // Check if the follower is already following the user
    const isAlreadyFollowing = await this.prisma.user.findFirst({
      where: {
        id: followerUser.id,
        following: { some: { id: followedUser.id } },
      },
    });

    if (isAlreadyFollowing) {
      throw new Error('You are already following this user.');
    }

    // Add the followed user to the follower's following list
    await this.prisma.user.update({
      where: { id: followerUser.id },
      data: { following: { connect: { id: followedUser.id } } },
    });
  }
}
