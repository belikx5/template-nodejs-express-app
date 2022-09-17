import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { BaseControoller } from '../common/base.controller';
import { ValidateMiddlware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserController } from './users.controller.interface';
import { IUserService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuardMiddleware } from '../common/auth.guard.middleware';

@injectable()
export class UserController extends BaseControoller implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddlware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddlware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuardMiddleware()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// this.ok(res, 'login OK');
		const result = await this.userService.validateUser(body);
		if (!result) return next(new HTTPError(401, 'invalid auth', 'login'));
		const jwt = await this.signJWT(
			body.email,
			this.configService.get('SECRET'),
		);
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'User already exist'));
		}
		this.ok(res, {
			email: result.email,
			name: result.name,
			id: result.id,
		});
	}

	async info(
		{ user }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getuserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) reject(err);
					else resolve(token as string);
				},
			);
		});
	}
}
