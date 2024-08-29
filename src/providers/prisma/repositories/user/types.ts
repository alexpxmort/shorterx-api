import { user as User } from '@prisma/client';
import { repository } from './repository';

export type UserRepository = typeof repository;

export type UserOrm = User;
