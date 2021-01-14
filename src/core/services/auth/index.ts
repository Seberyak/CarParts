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
} from "../../../../schemas/auth/validators";
import { assertResourceExist } from "../../utils/asserts";

@Injectable()
export class AuthService {
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
		const [docs, numDocs] = await Promise.all([
			this._UserModel.find(args),
			this._UserModel.count({}),
		]);

		return { docs, numDocs };
	}

	public async update(args: IAPUTUser): Promise<IRPUTUser> {
		const { _id, ...updateData } = args;
		const updatedUser = this._UserModel.findOneAndUpdate(
			{ _id },
			updateData,
			{ new: true }
		);
		assertResourceExist(updatedUser, "user");
		return updatedUser;
	}

	public async delete(args: IADELETEUser): Promise<IRDELETEUser> {
		return this._UserModel.deleteOne(args);
	}
}
