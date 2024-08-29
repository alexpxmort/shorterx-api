import { CREATED, NO_CONTENT, OK } from 'http-status';
import { Request, Response } from 'express';
import {
  createShortUrlPort,
  deleteShortUrlPort,
  getShortUrlByUserPort,
  getShortUrlPort
} from '@ports/usecases/url';

const createShortUrlController = async (req: Request, res: Response) => {
  return res.status(CREATED).json(
    await createShortUrlPort({
      ...req.body,
      userId: req.requestUserId
    })
  );
};

const getShortUrlController = async (req: Request, res: Response) => {
  const { shortId } = req.params;
  const originalUrl = await getShortUrlPort({ shortId });

  return res.redirect(originalUrl);
};

const getShortUrlControllerByUser = async (req: Request, res: Response) => {
  const shortedUrls = await getShortUrlByUserPort({
    userId: req.requestUserId ?? ''
  });

  return res.status(OK).json({ shortedUrls });
};

const deleteShortUrlController = async (req: Request, res: Response) => {
  const { shortId } = req.params;
  await deleteShortUrlPort({
    shortId,
    userId: req.requestUserId ?? ''
  });

  return res.status(NO_CONTENT).send();
};

export {
  createShortUrlController,
  getShortUrlController,
  getShortUrlControllerByUser,
  deleteShortUrlController
};
