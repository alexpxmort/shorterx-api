import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { client } from '@ports/clientDB';
import { ApiError } from '@usecases/shared/error';
import { DEFAULT_PORT_NUMBER } from '@helpers/constants';

type GetShortUrl = (
  urlRepository: UrlRepository
) => (params: { shortId: string }) => Promise<any>;

export const getShortUrl: GetShortUrl = (urlRepository) => async (params) => {
  const baseUrl =
    process.env.BASE_URL ||
    `http://localhost:${process.env.PORT_NUMBER ?? DEFAULT_PORT_NUMBER}`;

  const shortenUrl = await urlRepository(client).getOne({
    shortUrl: `${baseUrl}/${params.shortId}`,
    deletedAt: null
  });

  if (!shortenUrl) {
    throw ApiError.notFound('Url não existente!');
  }

  await urlRepository(client).edit(
    { clickCount: shortenUrl.clickCount + 1 },
    { id: shortenUrl.id }
  );

  return shortenUrl?.originalUrl;
};
