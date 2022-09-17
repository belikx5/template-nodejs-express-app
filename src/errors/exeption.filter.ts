import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExeptionFilter } from './exeption.filter.interface';
import { HTTPError } from './http-error';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		if (err instanceof HTTPError) {
			this.logger.error(`${err.context} Error ${err.code}: ${err.message} `);
			res.status(err.code).send({ err: err.message });
		} else {
			this.logger.error(`Error: ${err.message} `);
			res.status(500).send({ err: err.message });
		}
	}
}
