import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // Get all posts
  async getAllPosts() {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        likes: true,
      },
    });
  }

  // Get post by ID
  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  // Create a new post
  async createPost(createPostDto: CreatePostDto) {
    const { title, description, authorId } = createPostDto;

    return this.prisma.post.create({
      data: {
        title,
        description,
        author: { connect: { id: authorId } },
      },
    });
  }

  // Update a post
  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...updatePostDto,
      },
    });
  }

  // Delete a post
  async deletePost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.post.delete({ where: { id: parseInt(id) } });
  }
}
