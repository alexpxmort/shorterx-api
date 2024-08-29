import { UserRepository } from '@providers/prisma/repositories/user/types';
import { ApiError } from '@usecases/shared/error';
import { hashPassword } from '@helpers/passwordHelper';
import { createUser } from '@usecases/auth/createUser';

jest.mock('@helpers/passwordHelper');

describe('createUser', () => {
  const mockUserRepository = jest.fn().mockReturnValue({
    getOne: jest.fn(),
    save: jest.fn()
  });
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = 'hashedPassword';
  const newUserData = { email, password };
  const savedUser = { ...newUserData, password: hashedPassword, id: 'userId' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user WHEN the email does not exist', async () => {
    mockUserRepository().getOne.mockResolvedValue(null); // No user found
    (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository().save.mockResolvedValue(savedUser);

    const createUserFunction = createUser(
      mockUserRepository as unknown as UserRepository
    );

    const result = await createUserFunction(newUserData);

    expect(result).toEqual({ ...savedUser, password: undefined });
    expect(mockUserRepository().getOne).toHaveBeenCalledWith({ email });
    expect(hashPassword).toHaveBeenCalledWith(password);
    expect(mockUserRepository().save).toHaveBeenCalledWith({
      email,
      password: hashedPassword
    });
  });

  it('should throw an error WHEN the email already exists', async () => {
    mockUserRepository().getOne.mockResolvedValue({ email }); // User exists
    const createUserFunction = createUser(
      mockUserRepository as unknown as UserRepository
    );

    await expect(createUserFunction(newUserData)).rejects.toThrow(
      ApiError.badRequest('Email already exists!')
    );
  });
});
