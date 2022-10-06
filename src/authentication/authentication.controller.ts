import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './requestWithUser';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { JwtAuthenticationGuard } from './jwtAuthentication.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  authenticate(@Req() req: RequestWithUser) {
    const { user } = req;
    delete user.password;
    return user;
  }

  @Post('/register')
  async register(@Body() registerData: RegisterDto) {
    return this.authenticationService.register(registerData);
  }

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    res.setHeader('Set-Cookie', cookie);
    delete user.password;
    return res.send(user);
  }

  @Post('/logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Res() res: Response) {
    const cookie = this.authenticationService.getCookieForLogout();
    res.setHeader('Set-Cookie', cookie);
    return res.sendStatus(200);
  }
}
