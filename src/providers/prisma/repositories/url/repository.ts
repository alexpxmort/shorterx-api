import { PrismaClient } from '@prisma/client';
import { baseRepository } from '@providers/prisma/repositories/baseRepository';
import { UrlOrm } from './type';

const repository = (client: PrismaClient) => {
  const commonQuery = baseRepository<UrlOrm>(client, 'url', {
    description: 'Repository for Url',
    updatedAtField: 'updated_at',
    fieldsNotEditable: ['id', 'created_at', 'deleted_at', 'updated_at']
  });

  return {
    ...commonQuery
  };
};

export { repository };
