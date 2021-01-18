import { Injectable } from "@nestjs/common";
import { Part, IPartModel } from "../../models/typegoose/parts";
import { InjectModel } from "nestjs-typegoose";
import {
	IADELETEPart,
	IAGETManyPart,
	IAGETPart,
	IAPOSTPart,
	IAPUTPart,
	IRDELETEPart,
	IRGETManyPart,
	IRGETPart,
	IRPOSTPart,
	IRPUTPart,
} from "../../../../schemas/parts/validators";
import {
	assertResourceExist,
	assertUserHasPermission,
} from "../../utils/asserts";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { docToObj } from "../../utils/db-config";
import {
	IPartRatingModel,
	PartRating,
} from "../../models/typegoose/parts-rating";

@Injectable()
export class PartsService {
	constructor(
		@InjectModel(Part)
		private readonly _PartModel: IPartModel,

		@InjectModel(PartRating)
		private readonly _PartRatingModel: IPartRatingModel
	) {}

	public async create(args: IAPOSTPart, user: IUser): Promise<IRPOSTPart> {
		const part = new this._PartModel({
			...args,
			author: user._id,
			rating: 0,
		});
		return part.save();
	}

	public async get(args: IAGETPart): Promise<IRGETPart> {
		const part = await this._PartModel.findOne(args);
		assertResourceExist(part, "part");
		return part;
	}

	public async getMany(args: IAGETManyPart): Promise<IRGETManyPart> {
		return this._PartModel.getMany(args);
	}

	public async update(args: IAPUTPart, user: IUser): Promise<IRPUTPart> {
		const { _id, ...updateData } = args;
		const part = await this._PartModel
			.findById(_id)
			.then(doc => docToObj(doc));
		assertResourceExist(part, "part");
		assertUserHasPermission(user, part);

		return this._PartModel
			.updateOne(_id, updateData)
			.then(doc => docToObj(doc));
	}

	public async delete(
		args: IADELETEPart,
		user: IUser
	): Promise<IRDELETEPart> {
		const part = await this._PartModel
			.findById(args._id)
			.then(doc => docToObj(doc));
		assertResourceExist(part, "part");
		assertUserHasPermission(user, part);
		await this._PartRatingModel.deleteMany({ partId: args._id });
		return this._PartModel.deleteOne(args);
	}
}
