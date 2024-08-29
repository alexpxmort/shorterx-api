import { tracking } from '@providers/express/middlewares/tracking';
import { describe, expect, it } from '../../../../helper';

describe('Middlewares: Tracking', () => {
  let req: any, res: any, next: jest.Mock, setHeader: jest.Mock;

  beforeEach(() => {
    req = {
      id: '',
      headers: {}
    };
    setHeader = jest.fn();
    res = {
      headers: {},
      set: setHeader
    };
    next = jest.fn();
  });

  describe('tracking', () => {
    it('invokes the next function', () => {
      tracking(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('attaches x-track-id to response headers', () => {
      req.headers = {
        'x-track-id': 'x-track-id'
      };

      tracking(req, res, next);

      expect(setHeader).toHaveBeenCalledWith('X-Track-Id', 'x-track-id');
    });
  });
});
