import { CreateUserUseCase } from './create-user.use-case';
import { UserRepositoryImpl } from 'libs/infrastructure/src/database/repositories/user.repository.impl';
import { UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepo: jest.Mocked<UserRepositoryImpl>;

  beforeEach(() => {
    userRepo = {
      create: jest.fn(),
    } as any;

    createUserUseCase = new CreateUserUseCase(userRepo);
  });

  it('should hash the password and create a new user', async () => {
    const inputData = {
      name: 'Ericão',
      email: 'ericao@example.com',
      password: 'supersecret',
      role: UserRole.USER
    };

    const hashedPassword = 'hashedSuperSecret';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const createdUser = {
      ...inputData,
      password: hashedPassword,
      role: UserRole.USER,
    };

    userRepo.create.mockResolvedValue(createdUser as any);

    const result = await createUserUseCase.execute(inputData);

    expect(bcrypt.hash).toHaveBeenCalledWith(inputData.password, 10);
    expect(userRepo.create).toHaveBeenCalledWith({
      name: inputData.name,
      email: inputData.email,
      password: hashedPassword,
      role: UserRole.USER,
    });
    expect(result).toEqual(createdUser);
  });
});
