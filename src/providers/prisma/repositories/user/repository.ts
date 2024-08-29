import { PrismaClient } from '@prisma/client';
import { baseRepository } from '@providers/prisma/repositories/baseRepository';
import { UserOrm } from './types';

const repository = (client: PrismaClient) => {
  const commonQuery = baseRepository<UserOrm>(client, 'User', {
    description: 'Repository for User',
    updatedAtField: 'updated_at',
    fieldsNotEditable: ['id', 'created_at', 'updated_at']
  });

  return {
    ...commonQuery
  };
};

export { repository };
