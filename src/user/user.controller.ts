import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';

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
}
