import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleWare } from './middlware.interface';

export class AuthMiddleware implements IMiddleWare {
	constructor(private sercret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.sercret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					payload = payload as { email: string };
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
