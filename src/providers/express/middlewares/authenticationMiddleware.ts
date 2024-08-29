import { NextFunction, Request, Response } from 'express';
import { AuthError } from '@helpers/errors';
import { logger } from '@providers/pino/logger';
import { verifyToken } from '@usecases/auth/jwt';

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationToken = req.headers.authorization;

  if (!authorizationToken) {
    logger.info('No authorization token provided');
    return res.status(401).json(new AuthError('Access token is required'));
  }

  if (authorizationToken.startsWith('Bearer ')) {
    const accessToken = authorizationToken.substring(7);

    try {
      const user = verifyToken(accessToken) as { id: string };
      if (!user) {
        logger.info('Invalid token');
        return res.status(401).json(new AuthError('Invalid or expired token'));
      }

      // Attach the user to the request object (optional)
      req.requestUserId = user.id;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      logger.error('Token verification error', error);
      return res.status(401).json(new AuthError('Invalid or expired token'));
    }
  } else {
    logger.info('Invalid token type: ' + authorizationToken);
    return res
      .status(401)
      .json(new AuthError('Authentication token type is not valid'));
  }
};
