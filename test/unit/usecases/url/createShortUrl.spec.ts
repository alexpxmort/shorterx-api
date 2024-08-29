import { UrlRepository } from '@providers/prisma/repositories/url/type';
import { Str } from '@helpers/str';
import { createShortUrl } from '@usecases/url/createShortUrl';

jest.mock('@helpers/str');

describe('createShortUrl', () => {
  const mockUrlRepository = jest.fn().mockReturnValue({
    getOne: jest.fn(),
    save: jest.fn()
  });
  const originalUrl = 'http://example.com';
  const clickCount = 0;
  const userId = 'userId';
  const shortUrlData = {
    originalUrl,
    clickCount,
    shortUrl: 'http://localhost:7000/shortId',
    userId
  };

  const baseUrl = 'http://localhost:7000';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BASE_URL = baseUrl;
    process.env.PORT_NUMBER = '7000';
  });

  it('should create a new short URL if the short URL does not already exist', async () => {
    (Str.generateShortId as jest.Mock).mockReturnValue('shortId');
    mockUrlRepository().getOne.mockResolvedValue(null);
    mockUrlRepository().save.mockResolvedValue(shortUrlData);

    const createShortUrlFunction = createShortUrl(
      mockUrlRepository as unknown as UrlRepository
    );

    const result = await createShortUrlFunction({
      originalUrl,
      clickCount,
      userId
    });

    expect(result).toEqual(shortUrlData);
    expect(Str.generateShortId).toHaveBeenCalled();
    expect(mockUrlRepository().getOne).toHaveBeenCalledWith({
      shortUrl: `${baseUrl}/shortId`
    });
    expect(mockUrlRepository().save).toHaveBeenCalledWith(shortUrlData);
  });
});
