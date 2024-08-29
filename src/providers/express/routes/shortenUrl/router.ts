import { authenticationMiddleware } from '@providers/express/middlewares/authenticationMiddleware';
import { Router } from 'express';
import {
  createShortUrlController,
  deleteShortUrlController,
  getShortUrlControllerByUser
} from './shortUrl';
import { createShortUrlSchema } from './schema';

const router = Router();

router.get('/list', authenticationMiddleware, getShortUrlControllerByUser);

router.delete(
  '/remove/:shortId',
  authenticationMiddleware,
  deleteShortUrlController
);

router.post(
  '/create',
  (req, res, next) => authenticationMiddleware(req, res, next, false),
  createShortUrlSchema,
  createShortUrlController
);
export default router;
