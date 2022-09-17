import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepo: IUsersRepository,
	) {}
	async createUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const user = new User(email, name);
		const salt = this.configService.get('SALT');
		await user.setPassword(password, Number(salt));
		const existingUser = await this.usersRepo.find(email);
		// if already exist => null
		// else return new User
		if (existingUser) {
			return null;
		} else {
			return this.usersRepo.create(user);
		}
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existingUser = await this.usersRepo.find(email);
		if (!existingUser) {
			return false;
		} else {
			const user = new User(
				existingUser.email,
				existingUser.name,
				existingUser.password,
			);
			return user.comparePassword(password);
		}
	}

	async getuserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepo.find(email);
	}
}
