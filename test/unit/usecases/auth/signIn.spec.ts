import { UserRepository } from '@providers/prisma/repositories/user/types';
import { ApiError } from '@usecases/shared/error';
import { comparePasswords } from '@helpers/passwordHelper';
import { SignInUser } from '@usecases/auth/types';
import { signIn } from '@usecases/auth/signIn';
import * as jwtModule from '@usecases/auth/jwt';

jest.mock('@helpers/passwordHelper');
jest.mock('@providers/prisma/repositories/user/types', () => ({
  UserRepository: jest.fn()
}));

describe('signIn', () => {
  const mockUserRepository = jest.fn().mockReturnValue({
    getOne: jest.fn()
  });
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = 'hashedPassword';
  const user = { email, password: hashedPassword, name: 'John Doe' };
  const validToken = 'validToken';
  const signInUser: SignInUser = { email, password };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token WHEN the user is found and password is correct', async () => {
    mockUserRepository().getOne.mockResolvedValue(user);
    (comparePasswords as jest.Mock).mockResolvedValue(true);

    const spy = jest.spyOn(jwtModule, 'signToken').mockReturnValue({
      token: validToken,
      expiresIn: new Date()
    });

    const signInFunction = signIn(
      mockUserRepository as unknown as UserRepository
    );

    const result = await signInFunction(signInUser);

    expect(result.token).toBe(validToken);
    expect(comparePasswords).toHaveBeenCalledWith(password, hashedPassword);
    expect(spy).toHaveBeenCalledWith({ email, name: 'John Doe' }, '1h');
  });

  it('should throw an error WHEN the user is not found', async () => {
    mockUserRepository().getOne.mockResolvedValue(null);
    const signInFunction = signIn(
      mockUserRepository as unknown as UserRepository
    );

    await expect(signInFunction(signInUser)).rejects.toThrow(
      ApiError.notFound('User not Found!')
    );
  });

  it('should throw an error WHEN the password is incorrect', async () => {
    mockUserRepository().getOne.mockResolvedValue(user);
    (comparePasswords as jest.Mock).mockResolvedValue(false);
    const signInFunction = signIn(
      mockUserRepository as unknown as UserRepository
    );

    await expect(signInFunction(signInUser)).rejects.toThrow(
      ApiError.unAuthorized('Invalid Login!')
    );
  });
});
