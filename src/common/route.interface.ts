import { Request, NextFunction, Response, Router } from 'express';
import { IMiddleWare } from './middlware.interface';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	// method: 'get' | 'post' | 'delete' | 'patch' | 'put'
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleWare[];
}
