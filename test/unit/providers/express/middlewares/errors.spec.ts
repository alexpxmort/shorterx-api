import { IRequest } from '@providers/express/interfaces/Request';
import { errors } from '@providers/express/middlewares/errors';
import { createSpyResponse } from '@test/utils/spyResponse';
import { CelebrateError } from 'celebrate';
import { NOT_FOUND } from 'http-status';

describe('Provider express: Errors', () => {
  let res: any, next: any, req: any;

  beforeEach(() => {
    req = { headers: { tracking: { trkid: 1, reqid: 2 } } };
    next = jest.fn();
    res = createSpyResponse();
  });

  describe('When is a celebrate error', () => {
    it('should call res with correct values', async () => {
      const values = [{ message: 'Body with invalid format' }];
      const details = new Map();
      const celebrateError = new CelebrateError('name', { celebrated: true });
      details.set('body', { details: values });
      celebrateError.details = details;

      errors(celebrateError, req as IRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Parâmetros Inválidos: Body with invalid format',
        logMessage: 'Body with invalid format'
      });
    });

    it('should call res with correct values and empty request', async () => {
      const values = [{ message: 'Body with invalid format' }];
      const details = new Map();
      const celebrateError = new CelebrateError('name', { celebrated: true });

      req = {};
      details.set('body', { details: values });
      celebrateError.details = details;

      errors(celebrateError, req as IRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('When not is a celebrate error', () => {
    it('should call res with known http status', async () => {
      const err = {
        statusCode: 404,
        title: 'Nada encontrado',
        message: 'not found'
      };

      const values = [{ message: 'Body with invalid format' }];
      const details = new Map();
      details.set('body', { details: values });

      req = {};
      errors(err, req as IRequest, res, next);

      expect(res.status).toHaveBeenCalledWith(NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        title: 'Nada encontrado',
        message: 'not found',
        logMessage: 'not found'
      });
    });
  });
});
