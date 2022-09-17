import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from './middlware.interface';

export class AuthGuardMiddleware implements IMiddleWare {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Not authorized' });
	}
}
