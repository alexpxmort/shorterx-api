import { Router } from 'express';
import { signIn, createUser } from './auth';
import { signInSchema, userCreateSchema } from './schema';

const router = Router();

router.post('/signin', signInSchema, signIn);
router.post('/create', userCreateSchema, createUser);

export default router;
