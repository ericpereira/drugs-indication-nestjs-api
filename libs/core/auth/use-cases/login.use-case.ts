import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../../src/auth/auth.service';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(data: { email: string; password: string }) {
    const user = await this.authService.validateUser(data.email, data.password);
    return this.authService.login(user);
  }
}
