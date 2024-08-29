import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { getShortUrlByUser } from '@usecases/url/getShortUrlByUser';

describe('getShortUrlByUser', () => {
  const mockUrlRepository = jest.fn().mockReturnValue({
    getAll: jest.fn()
  });

  const userId = 'userId123';
  const urlsList = [
    {
      shortUrl: 'http://localhost:7000/short1',
      clickCount: 10,
      deletedAt: null
    },
    {
      shortUrl: 'http://localhost:7000/short2',
      clickCount: 5,
      deletedAt: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BASE_URL = 'http://localhost:7000';
    process.env.PORT_NUMBER = '7000';
  });

  it('should return a list of short URLs for the given user ID', async () => {
    // Arrange
    mockUrlRepository().getAll.mockResolvedValue(urlsList);

    const getShortUrlByUserFunction = getShortUrlByUser(
      mockUrlRepository as unknown as UrlRepository
    );

    const result = await getShortUrlByUserFunction({ userId });

    expect(result).toEqual(
      urlsList.map((url) => ({
        url: url.shortUrl,
        clickCount: url.clickCount,
        deletedAt: url.deletedAt
      }))
    );
    expect(mockUrlRepository().getAll).toHaveBeenCalledWith({
      where: {
        userId
      }
    });
  });

  it('should return an empty list WHEN no URLs are found for the given user ID', async () => {
    mockUrlRepository().getAll.mockResolvedValue([]);

    const getShortUrlByUserFunction = getShortUrlByUser(
      mockUrlRepository as unknown as UrlRepository
    );

    const result = await getShortUrlByUserFunction({ userId });

    expect(result).toEqual([]);
    expect(mockUrlRepository().getAll).toHaveBeenCalledWith({
      where: {
        userId
      }
    });
  });
});
