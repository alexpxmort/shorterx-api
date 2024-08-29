import { repository as urlRepository } from '@providers/prisma/repositories/url/repository';

import { createShortUrl } from '@usecases/url/createShortUrl';
import { getShortUrlByUser } from '@usecases/url/getShortUrlByUser';
import { getShortUrl } from '@usecases/url/getShortUrl';
import { ShortUrlCreate } from '@usecases/url/types';
import { deleteShortUrl } from '@usecases/url/deleteShortUrl';

export const createShortUrlPort = async (data: ShortUrlCreate) =>
  createShortUrl(urlRepository)(data);

export const getShortUrlPort = async (params: { shortId: string }) =>
  getShortUrl(urlRepository)(params);

export const getShortUrlByUserPort = async (params: { userId: string }) =>
  getShortUrlByUser(urlRepository)(params);

export const deleteShortUrlPort = async (params: {
  shortId: string;
  userId: string;
}) => deleteShortUrl(urlRepository)(params);
