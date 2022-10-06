import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
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
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @Post('/logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Req() request: Request) {
    const cookie = this.authenticationService.getCookieForLogout();
    request.res.setHeader('Set-Cookie', cookie);
  }
}
