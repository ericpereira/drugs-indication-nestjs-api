import { UserRepositoryImpl } from 'libs/infrastructure/src/database/repositories/user.repository.impl';
import { User } from '../entities/user.entity';

export class FindUserByEmailUseCase {
  constructor(private readonly userRepo: UserRepositoryImpl) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }
}
