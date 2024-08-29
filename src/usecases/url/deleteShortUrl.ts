import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { client } from '@ports/clientDB';
import { ApiError } from '@usecases/shared/error';

type DeleteShortUrl = (
  urlRepository: UrlRepository
) => (params: { shortId: string; userId: string }) => Promise<any>;

export const deleteShortUrl: DeleteShortUrl =
  (urlRepository) => async (params) => {
    const baseUrl =
      process.env.BASE_URL ||
      `http://localhost:${process.env.PORT_NUMBER ?? '7000'}`;

    const shortenUrl = await urlRepository(client).getOne({
      shortUrl: `${baseUrl}/${params.shortId}`,
      deletedAt: null,
      userId: params.userId
    });

    if (!shortenUrl) {
      throw ApiError.notFound('Url não existente!');
    }

    await urlRepository(client).edit(
      { deletedAt: new Date() },
      { id: shortenUrl.id }
    );
  };