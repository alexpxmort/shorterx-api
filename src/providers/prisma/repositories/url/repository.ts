import { PrismaClient } from '@prisma/client';
import { baseRepository } from '@providers/prisma/repositories/baseRepository';
import { UrlOrm } from './type';

const repository = (client: PrismaClient) => {
  const commonQuery = baseRepository<UrlOrm>(client, 'url', {
    description: 'Repository for Url',
    updatedAtField: 'updatedAt',
    fieldsNotEditable: ['id', 'createdAt', 'updatedAt']
  });

  return {
    ...commonQuery
  };
};

export { repository };
