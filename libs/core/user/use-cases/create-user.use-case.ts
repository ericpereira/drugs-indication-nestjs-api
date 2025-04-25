import { UserRepositoryImpl } from 'libs/infrastructure/src/database/repositories/user.repository.impl';
import { User, UserRole } from '../entities/user.entity';
import { UserDTO } from '../interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepositoryImpl) {}

  async execute(data: UserDTO): Promise<User> {
    // encrypt password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: UserRole.USER
    });
  }
}
