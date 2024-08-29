import { client } from '@ports/clientDB';
import { UrlRepository } from '@providers/prisma/repositories/url/type';

type GetShortUrlByUser = (
  urlRepository: UrlRepository
) => (params: { userId: string }) => Promise<any>;

export const getShortUrlByUser: GetShortUrlByUser =
  (urlRepository) => async (params) => {
    const urlsList = await urlRepository(client).getAll({
      where: {
        userId: params.userId
      }
    });

    return (
      urlsList?.map((url) => {
        return {
          url: url.shortUrl,
          clickCount: url.clickCount,
          deletedAt: url.deletedAt
        };
      }) ?? []
    );
  };
