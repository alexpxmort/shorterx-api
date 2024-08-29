import express from 'express';
import { randomUUID } from 'crypto';
import { IRequest } from '../interfaces/Request';

const tracking = (
  req: IRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const tracking = {
    reqid: randomUUID(),
    trkid: req.headers['x-track-id'] || randomUUID()
  };

  req.headers.tracking = tracking;

  res.set('X-Request-Id', tracking.reqid);
  res.set('X-Track-Id', tracking.trkid);

  next();
};

export { tracking };
