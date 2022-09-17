import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { IUserController } from './users/users.controller.interface';
import { UsersRepository } from './users/users.repository';
import { IUsersRepository } from './users/users.repository.interface';
import { UserService } from './users/users.service';
import { IUserService } from './users/users.service.interface';

//old dependency injection (manual)
// const logger = new LoggerService();
// const app = new App(
// 	logger,
// 	new UserController(logger),
// 	new ExeptionFilter(logger)
// );

// dep. inj. with inversify
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IExeptionFilter>(TYPES.ExeptionController).to(ExeptionFilter);
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
	bind<IConfigService>(TYPES.ConfigService)
		.to(ConfigService)
		.inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserController>(TYPES.UserController)
		.to(UserController)
		.inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository)
		.to(UsersRepository)
		.inSingletonScope();
});

async function bootstrap() {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { app, appContainer };
}
export const boot = bootstrap();
