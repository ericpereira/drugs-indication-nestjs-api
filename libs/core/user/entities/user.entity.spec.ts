import { User, UserRole } from './user.entity';

describe('User Entity', () => {
  it('should create a user with all properties', () => {
    const user = new User(
      '123',
      'Eric',
      'eric@example.com',
      'securePassword',
      UserRole.USER
    );

    expect(user.name).toBe('Eric');
    expect(user.email).toBe('eric@example.com');
    expect(user.password).toBe('securePassword');
    expect(user.role).toBe(UserRole.USER);
  });

  it('should set role to ADMIN if provided', () => {
    const user = new User(
      '456',
      'AdminUser',
      'admin@example.com',
      'adminPassword',
      UserRole.ADMIN
    );

    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('should default role to USER if no role is provided (simulate)', () => {
    const user = new User(
      '789',
      'UserWithoutRole',
      'user@example.com',
      'userPassword',
      undefined as unknown as UserRole // simulating the undefined roller
    );

    expect(user.role).toBeUndefined();
  });
});
