import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }

  @Put('me')
  @UseGuards(JwtGuard)
  editMe(@Body() changeData, @GetUser() user: User) {
    return this.userService.editMe(changeData, user);
  }

  @Post('me/image')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only JPG, JPEG, and PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.userService.addImage(user, file.path);
  }

  @Post('me/background')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only JPG, JPEG, and PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadBackground(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.userService.addBackgroundImage(user, file.path);
  }

  @Delete('me')
  @UseGuards(JwtGuard)
  deleteMe(@GetUser() user: User) {
    return this.userService.deleteMe(user);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get('')
  getUsers(orderBy: string, limit: number) {
    return this.userService.getUsers(orderBy, limit);
  }

  @UseGuards(JwtGuard)
  @Post('/follow/:userId')
  async followUser(@Param('userId') userId: number, @GetUser() user: User) {
    await this.userService.followUser(user, Number(userId));
    return { message: 'Successfully followed user.' };
  }
}
