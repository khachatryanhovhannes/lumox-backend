import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignInDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async signWithGoogle() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res) {
    const data = await this.authService.signWithGoogle(req);
    if (typeof data !== 'string') {
      return res.redirect(
        `http://localhost:3000/?access_token=${data.access_token}`,
      );
    } else {
      return res.redirect(`http://localhost:3000/`);
    }
  }
}
