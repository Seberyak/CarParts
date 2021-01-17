import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { MError } from "../../utils/errors";
import { InjectModel } from "nestjs-typegoose";
import { IUserModel, User } from "../../models/typegoose/users";
import { docToObj } from "../../utils/db-config";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { sha512 } from "js-sha512";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectModel(User)
		private readonly _UserModel: IUserModel
	) {
		super({ usernameField: "mail" });
	}

	async validate(mail: string, password: string): Promise<IUser> {
		const user = await this._UserModel
			.findOne({ mail: mail, password: sha512(password) })
			.then(doc => docToObj(doc));
		if (!user) {
			throw new MError(401, "Not Authorized");
		}
		return user;
	}
}
