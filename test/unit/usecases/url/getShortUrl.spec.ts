import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { ApiError } from '@usecases/shared/error';
import { getShortUrl } from '@usecases/url/getShortUrl';

describe('getShortUrl', () => {
  const mockUrlRepository = jest.fn().mockReturnValue({
    getOne: jest.fn(),
    edit: jest.fn()
  });

  const shortId = 'shortId';
  const baseUrl = 'http://localhost:7000';
  const shortUrl = `${baseUrl}/${shortId}`;
  const existingShortUrl = {
    id: 'urlId',
    originalUrl: 'http://example.com',
    shortUrl,
    clickCount: 5,
    deletedAt: null
  };
  const updatedShortUrl = {
    ...existingShortUrl,
    clickCount: existingShortUrl.clickCount + 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BASE_URL = baseUrl;
    process.env.PORT_NUMBER = '7000';
  });

  it('should return the original URL and increment click count WHEN the short URL exists', async () => {
    mockUrlRepository().getOne.mockResolvedValue(existingShortUrl);
    mockUrlRepository().edit.mockResolvedValue(undefined);

    const getShortUrlFunction = getShortUrl(
      mockUrlRepository as unknown as UrlRepository
    );

    const result = await getShortUrlFunction({ shortId });

    expect(result).toBe(existingShortUrl.originalUrl);
    expect(mockUrlRepository().getOne).toHaveBeenCalledWith({
      shortUrl,
      deletedAt: null
    });
    expect(mockUrlRepository().edit).toHaveBeenCalledWith(
      { clickCount: updatedShortUrl.clickCount },
      { id: existingShortUrl.id }
    );
  });

  it('should throw ApiError.notFound WHEN the short URL does not exist', async () => {
    mockUrlRepository().getOne.mockResolvedValue(null);

    const getShortUrlFunction = getShortUrl(
      mockUrlRepository as unknown as UrlRepository
    );

    await expect(getShortUrlFunction({ shortId })).rejects.toThrow(
      ApiError.notFound('Url não existente!')
    );
    expect(mockUrlRepository().getOne).toHaveBeenCalledWith({
      shortUrl,
      deletedAt: null
    });
    expect(mockUrlRepository().edit).not.toHaveBeenCalled();
  });
});
