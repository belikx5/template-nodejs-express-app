import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Incorrect email' })
	email: string;
	@IsString({ message: 'Missing password' })
	password: string;
	@IsString({ message: 'Missing name' })
	name: string;
}
