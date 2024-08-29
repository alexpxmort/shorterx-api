import express from 'express';
import authRouter from './auth/router';
import shortenUrlRouter from './shortenUrl/router';
import { getShortUrlController } from './shortenUrl/shortUrl';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/shortenUrl', shortenUrlRouter);

router.get('/:shortId', getShortUrlController);

export { router };
