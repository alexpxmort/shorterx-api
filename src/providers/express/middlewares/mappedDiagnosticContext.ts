import express from 'express';

import { IRequest } from '../interfaces/Request';

const clsCorrelationId =
  (namespace: any) =>
  (req: IRequest, res: express.Response, next: express.NextFunction) => {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);
    namespace.run(() => {
      namespace.set('correlationId', req.headers.tracking.trkid);
      next();
    });
  };

export { clsCorrelationId };
