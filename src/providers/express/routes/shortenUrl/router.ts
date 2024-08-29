import { authenticationMiddleware } from '@providers/express/middlewares/authenticationMiddleware';
import { Router } from 'express';
import { Response, Request } from 'express';

const router = Router();

router.get('/', authenticationMiddleware, (req: Request, res: Response) => {
  res.json({ userId: req.requestUserId });
});

export default router;
