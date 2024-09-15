import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/')
  @UseGuards(JwtGuard)
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post('/')
  @UseGuards(JwtGuard)
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
