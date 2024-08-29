import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { ApiError } from '@usecases/shared/error';
import { deleteShortUrl } from '@usecases/url/deleteShortUrl';

describe('deleteShortUrl', () => {
  const mockUrlRepository = jest.fn().mockReturnValue({
    getOne: jest.fn(),
    edit: jest.fn()
  });

  const baseUrl = 'http://localhost:7000';
  const shortId = 'short123';
  const userId = 'userId123';
  const fullShortUrl = `${baseUrl}/${shortId}`;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BASE_URL = baseUrl;
    process.env.PORT_NUMBER = '7000';
  });

  it('should successfully delete a short URL', async () => {
    // Arrange
    const shortenUrl = {
      id: 'urlId123',
      shortUrl: fullShortUrl,
      clickCount: 10,
      deletedAt: null,
      userId
    };

    mockUrlRepository().getOne.mockResolvedValue(shortenUrl);
    mockUrlRepository().edit.mockResolvedValue(undefined);

    const deleteShortUrlFunction = deleteShortUrl(
      mockUrlRepository as unknown as UrlRepository
    );

    await deleteShortUrlFunction({ shortId, userId });

    expect(mockUrlRepository().getOne).toHaveBeenCalledWith({
      shortUrl: fullShortUrl,
      deletedAt: null,
      userId
    });
    expect(mockUrlRepository().edit).toHaveBeenCalled();
  });

  it('should throw ApiError.notFound WHEN the short URL does not exist', async () => {
    mockUrlRepository().getOne.mockResolvedValue(null);

    const deleteShortUrlFunction = deleteShortUrl(
      mockUrlRepository as unknown as UrlRepository
    );

    await expect(deleteShortUrlFunction({ shortId, userId })).rejects.toThrow(
      ApiError.notFound('Url não existente!')
    );

    expect(mockUrlRepository().getOne).toHaveBeenCalledWith({
      shortUrl: fullShortUrl,
      deletedAt: null,
      userId
    });
    expect(mockUrlRepository().edit).not.toHaveBeenCalled();
  });
});
