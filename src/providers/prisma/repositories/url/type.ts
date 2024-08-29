import { url as UrlPrisma } from '@prisma/client';
import { repository } from './repository';

export type UrlRepository = typeof repository;

export type UrlOrm = UrlPrisma;
