import { UserRepository } from '@providers/prisma/repositories/user/types';
import { SignInUser } from './types';
import { client } from '@ports/clientDB';
import { ApiError } from '@usecases/shared/error';
import { comparePasswords } from '@helpers/passwordHelper';
import { signToken } from './jwt';

type SignIn = (
  authRepository: UserRepository
) => (data: SignInUser) => Promise<any>;

export const signIn: SignIn = (authRepository) => async (data) => {
  const user: any = await authRepository(client).getOne({
    email: data.email
  });

  if (!user) {
    throw ApiError.notFound(`User not Found!`);
  }

  const validLogin = await comparePasswords(data.password, user.password);

  if (!validLogin) {
    throw ApiError.unAuthorized(`Invalid Login!`);
  }

  user.password = undefined;

  const result = signToken(user, '1h');

  return result;
};
