import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate a correct CreateUserDto', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Eric';
    dto.email = 'eric@example.com';
    dto.password = '123456';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateUserDto();
    dto.name = '';
    dto.email = 'eric@example.com';
    dto.password = '123456';

    const errors = await validate(dto);

    expect(errors.some(err => err.property === 'name')).toBeTruthy();
  });

  it('should fail if email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Eric';
    dto.email = 'not-an-email';
    dto.password = '123456';

    const errors = await validate(dto);

    expect(errors.some(err => err.property === 'email')).toBeTruthy();
  });

  it('should fail if password is too short', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Eric';
    dto.email = 'eric@example.com';
    dto.password = '123';

    const errors = await validate(dto);

    expect(errors.some(err => err.property === 'password')).toBeTruthy();
  });
});
