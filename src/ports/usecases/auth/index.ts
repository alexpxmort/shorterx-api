import { signIn } from '@usecases/auth/signIn';
import { SignInUser, UserCreate } from '@usecases/auth/types';
import { repository as userRepository } from '@providers/prisma/repositories/user/repository';
import { createUser } from '@usecases/auth/createUser';

export const userSignIn = async (user: SignInUser) =>
  signIn(userRepository)(user);

export const userCreate = async (data: UserCreate) =>
  createUser(userRepository)(data);
