import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.password = 'secure123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateUserDto();
    dto.name = '';
    dto.email = 'john.doe@example.com';
    dto.password = 'secure123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.email = 'not-an-email';
    dto.password = 'secure123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail if password is too short', async () => {
    const dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });
});