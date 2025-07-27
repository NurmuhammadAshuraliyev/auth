import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRegisterDto } from './dto/create.register.dto';
import { Response } from 'express';
import { loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.register(createRegisterDto);

    res.cookie('token', token, {
      maxAge: 24.1 * 60 * 60 * 1000,
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
      path: '/',
    });

    return { token, user };
  }

  @Post('/login')
  async login(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(loginDto);

    res.cookie('token', token, {
      maxAge: 24.1 * 60 * 60 * 1000,
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
      path: '/',
    });

    return { token, user };
  }
}
