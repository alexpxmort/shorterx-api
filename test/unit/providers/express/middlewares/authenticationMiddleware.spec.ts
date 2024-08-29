import { Request, Response, NextFunction } from 'express';
import { AuthError } from '@helpers/errors';
import { verifyToken } from '@usecases/auth/jwt';
import { authenticationMiddleware } from '@providers/express/middlewares/authenticationMiddleware';

jest.mock('@usecases/auth/jwt');

describe('authenticationMiddleware', () => {
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  it('should return 401 if no authorization token is provided', async () => {
    mockRequest.headers = {};

    await authenticationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      new AuthError('Access token is required')
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token type is not Bearer', async () => {
    mockRequest.headers.authorization = 'InvalidToken';

    await authenticationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      new AuthError('Authentication token type is not valid')
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    mockRequest.headers.authorization = 'Bearer invalidtoken';
    (verifyToken as jest.Mock).mockReturnValue(null);

    await authenticationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      new AuthError('Invalid or expired token')
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', async () => {
    const validUser = { id: 'user123' };
    mockRequest.headers.authorization = 'Bearer validtoken';
    (verifyToken as jest.Mock).mockReturnValue(validUser);

    await authenticationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.requestUserId).toEqual(validUser.id);
  });
});
