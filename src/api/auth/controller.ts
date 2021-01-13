import { Controller, Delete, Get, Post } from "@nestjs/common";
import { wValidatedArg } from "../../core/utils/decorators/validation";
import { IUser, UserSchema } from "../../../schemas/auth/helper-schemas";
import { User, UserModel } from "../../core/models/typegoose/users";
import { InjectModel } from "nestjs-typegoose";

@Controller("api/auth")
export class AuthController {
	constructor(
		@InjectModel(User)
		private readonly _UserModel: UserModel
	) {}

	@Post("/register")
	async register(@wValidatedArg(UserSchema) args: IUser): Promise<IUser> {
		console.log(args);

		const newUser = new this._UserModel(args);
		return newUser.save();
	}
	@Get("/")
	async getAll(): Promise<IUser[]> {
		return this._UserModel.find();
	}

	@Delete()
	async deleteAll(): Promise<any> {
		return this._UserModel.deleteMany({});
	}
}
