import express from 'express';
import authRouter from './auth/router';
import shortenUrlRouter from './shortenUrl/router';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/shortenUrl', shortenUrlRouter);

export { router };
