
import { LoginUseCase } from "libs/core/auth/use-cases/login.use-case";
import { AuthService } from "../../../../src/auth/auth.service";


describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let authService: AuthService;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    } as any;
    loginUseCase = new LoginUseCase(authService);
  });

  it('should validate user and return token', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockToken = { access_token: 'jwt-token' };

    (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
    (authService.login as jest.Mock).mockResolvedValue(mockToken);

    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(authService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockToken);
  });
});
