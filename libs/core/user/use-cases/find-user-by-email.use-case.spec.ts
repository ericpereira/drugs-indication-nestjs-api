import { FindUserByEmailUseCase } from './find-user-by-email.use-case';
import { UserRepositoryImpl } from 'libs/infrastructure/src/database/repositories/user.repository.impl';
import { User } from '../entities/user.entity';

describe('FindUserByEmailUseCase', () => {
  let findUserByEmailUseCase: FindUserByEmailUseCase;
  let userRepo: jest.Mocked<UserRepositoryImpl>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
    } as any;

    findUserByEmailUseCase = new FindUserByEmailUseCase(userRepo);
  });

  it('should find a user by email', async () => {
    const email = 'ericao@example.com';
    const mockUser = {
      _id: '123',
      name: 'Ericão',
      email,
      password: 'hashedpassword',
      role: 'USER',
    } as unknown as User;

    userRepo.findByEmail.mockResolvedValue(mockUser);

    const result = await findUserByEmailUseCase.execute(email);

    expect(userRepo.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found', async () => {
    const email = 'notfound@example.com';

    userRepo.findByEmail.mockResolvedValue(null);

    const result = await findUserByEmailUseCase.execute(email);

    expect(userRepo.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toBeNull();
  });
});
