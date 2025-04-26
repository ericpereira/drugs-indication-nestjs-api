import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUseCase } from 'libs/core/auth/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginUseCase: LoginUseCase
  ) {}

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    return this.loginUseCase.execute(data);
  }
}
