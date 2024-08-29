import { UserRepository } from '@providers/prisma/repositories/user/types';
import { client } from '@ports/clientDB';
import { UserCreate } from './types';
import { ApiError } from '@usecases/shared/error';
import { hashPassword } from '@helpers/passwordHelper';

type CreateUser = (
  authRepository: UserRepository
) => (data: UserCreate) => Promise<any>;

export const createUser: CreateUser = (authRepository) => async (data) => {
  const user = await authRepository(client).getOne({
    email: data.email
  });

  if (user) {
    throw ApiError.badRequest(`Email already exists!`);
  }

  data.password = await hashPassword(data.password);
  const newUser: any = await authRepository(client).save(data);
  newUser.password = undefined;
  return newUser;
};
