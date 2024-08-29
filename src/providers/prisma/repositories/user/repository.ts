import { PrismaClient } from '@prisma/client';
import { baseRepository } from '@providers/prisma/repositories/baseRepository';
import { UserOrm } from './types';

const repository = (client: PrismaClient) => {
  const commonQuery = baseRepository<UserOrm>(client, 'user', {
    description: 'Repository for User',
    updatedAtField: 'updatedAt',
    fieldsNotEditable: ['id', 'createdAt', 'updatedAt']
  });

  return {
    ...commonQuery
  };
};

export { repository };
