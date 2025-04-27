import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../../core/user/entities/user.entity';
import { UserRepositoryImpl } from './user.repository.impl';

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepositoryImpl;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const userDto = { email: 'test@example.com', name: 'Test User' } as any;
      const createdUser = { _id: 'userId', ...userDto } as User;

      (userModel.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await userRepository.create(userDto);

      expect(userModel.create).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const email = 'test@example.com';
      const foundUser = { _id: 'userId', email, name: 'Test User' };

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(foundUser),
      };

      (userModel.findOne as jest.Mock).mockReturnValue(mockQuery);

      const result = await userRepository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(foundUser);
    });

    it('should return null if no user found by email', async () => {
      const email = 'notfound@example.com';

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      (userModel.findOne as jest.Mock).mockReturnValue(mockQuery);

      const result = await userRepository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });
});
