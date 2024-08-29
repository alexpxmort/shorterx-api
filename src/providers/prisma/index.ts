import { PrismaClient } from '@prisma/client';

let options = {};
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
  options = Object.assign(options, { log: ['query'] });
}

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  ...options
});

export default prisma;
