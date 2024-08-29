import { Request, Response } from 'express';
import { userSignIn, userCreate } from '@ports/usecases/auth';
import { CREATED } from 'http-status';

const signIn = async (req: Request, res: Response) => {
  return res.json(await userSignIn(req.body));
};

const createUser = async (req: Request, res: Response) => {
  return res.status(CREATED).json(await userCreate(req.body));
};

export { signIn, createUser };
