import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users";
import {
	IAPOSTFirebaseLogin,
	IAPOSTUser,
	IRPOSTFirebaseLogin,
	IRPOSTUser,
} from "../../../../schemas/auth/validators";
import { UserTypes } from "../../../../schemas/user/user-types";
import { InjectModel } from "nestjs-typegoose";
import { IUserModel, User } from "../../models/typegoose/users";
import { docToObj } from "../../utils/db-config";
import { getTokenFromUser } from "../../utils/common";

@Injectable()
export class AuthService {
	constructor(
		private _UsersService: UsersService,
		private _JwtService: JwtService,
		@InjectModel(User)
		private readonly _UserModel: IUserModel
	) {}
	public async register(args: IAPOSTUser): Promise<IRPOSTUser> {
		return this._UsersService.create(args);
	}

	public async firebaseLogin(
		args: IAPOSTFirebaseLogin
	): Promise<IRPOSTFirebaseLogin> {
		const user: IAPOSTUser = {
			firstName: null,
			lastName: null,
			password: null,
			phoneNumber: args.phoneNumber,
			email: args.email,
			firebaseMetadata: args,
			type: UserTypes.Default,
		};

		const existUser = await this._UserModel.findOne({
			phoneNumber: args.phoneNumber,
		});

		if (!!existUser) {
			existUser.firebaseMetadata = args;
			existUser.markModified("firebaseMetadata");
			await existUser.save();

			return {
				"access-token": getTokenFromUser(docToObj(existUser)),
			};
		}
		const newUser = new this._UserModel(user);
		await newUser.save();

		return {
			"access-token": getTokenFromUser(docToObj(newUser)),
		};
	}
}
