import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepoMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepo: IUsersRepository;
let userService: IUserService;

let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container
		.bind<IConfigService>(TYPES.ConfigService)
		.toConstantValue(ConfigServiceMock);
	container
		.bind<IUsersRepository>(TYPES.UsersRepository)
		.toConstantValue(UsersRepoMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepo = container.get<IUsersRepository>(TYPES.UsersRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepo.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await userService.createUser({
			email: 'email@mail.com',
			name: 'TEST',
			password: 'nopass',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual(1);
	});

	it('validate user - success', async () => {
		usersRepo.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'email@mail.com',
			password: 'nopass',
		});
		expect(res).toBeTruthy();
	});

	it('validate user - wrong password', async () => {
		usersRepo.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({
			email: 'email@mail.com',
			password: 'invalidPass',
		});
		expect(res).toBeTruthy();
	});
});
