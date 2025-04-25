import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from 'libs/core/user/use-cases/create-user.use-case';
import { User } from 'libs/core/user/entities/user.entity';
import { UserDTO } from 'libs/core/user/interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  // Route to create a user
  @Post()
  async create(@Body() data: UserDTO): Promise<User> {
    return this.createUserUseCase.execute(data);
  }
}
