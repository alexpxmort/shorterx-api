import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { ShortUrlCreate } from './types';
import { client } from '@ports/clientDB';
import { Str } from '@helpers/str';

type CreateShortUrl = (
  urlRepository: UrlRepository
) => (data: ShortUrlCreate) => Promise<any>;

export const createShortUrl: CreateShortUrl =
  (urlRepository) => async (data) => {
    let shortId = Str.generateShortId(6);

    const baseUrl =
      process.env.BASE_URL ||
      `http://localhost:${process.env.PORT_NUMBER ?? '7000'}`;

    const existsShortenUrl = await urlRepository(client).getOne({
      shortUrl: `${baseUrl}/${shortId}`
    });

    while (existsShortenUrl) {
      shortId = Str.generateShortId(6);
    }

    const dataToCreate = {
      originalUrl: data.originalUrl,
      clickCount: data.clickCount ?? 0,
      shortUrl: `${baseUrl}/${shortId}`,
      userId: data.userId ? data.userId : null
    };

    return await urlRepository(client).save(dataToCreate);
  };
