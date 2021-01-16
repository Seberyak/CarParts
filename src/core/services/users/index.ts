import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { User, IUserModel } from "../../models/typegoose/users";
import {
	IADELETEUser,
	IAGETManyUser,
	IAGETUser,
	IAPOSTUser,
	IAPUTUser,
	IRDELETEUser,
	IRGETManyUser,
	IRGETUser,
	IRPOSTUser,
	IRPUTUser,
} from "../../../../schemas/user/validators";
import {
	assertResourceExist,
	assertUserHasPermission,
} from "../../utils/asserts";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { docToObj } from "../../utils/db-config";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private readonly _UserModel: IUserModel
	) {}

	public async create(args: IAPOSTUser): Promise<IRPOSTUser> {
		const user = new this._UserModel(args);
		return user.save();
	}

	public async get(args: IAGETUser): Promise<IRGETUser> {
		const user = await this._UserModel.findOne(args);
		assertResourceExist(user, "user");
		return user;
	}

	public async getMany(args: IAGETManyUser): Promise<IRGETManyUser> {
		return this._UserModel.getManyDocs(args);
	}

	public async update(args: IAPUTUser, user: IUser): Promise<IRPUTUser> {
		const { _id, ...updateData } = args;
		const userDocument = await this._UserModel
			.findById(_id)
			.then(doc => docToObj(doc));
		assertResourceExist(userDocument, "user");
		assertUserHasPermission(user, { author: userDocument._id });
		return this._UserModel
			.findByIdAndUpdate(_id, updateData, { new: true })
			.then(doc => docToObj(doc));
	}

	public async delete(args: IADELETEUser): Promise<IRDELETEUser> {
		return this._UserModel.deleteOne(args);
	}
}
