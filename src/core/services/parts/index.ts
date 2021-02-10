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
import { IPart } from "../../../../schemas/parts/helper-schemas";
import { SqlArticlesHelper } from "../sql-articles/helpers";
import { Connection } from "typeorm";
import { PartTags } from "./helpers/tags";

@Injectable()
export class PartsService {
	private readonly Helper: SqlArticlesHelper;
	private readonly manager;
	constructor(
		@InjectModel(Part)
		private readonly _PartModel: IPartModel,

		@InjectModel(PartRating)
		private readonly _PartRatingModel: IPartRatingModel,
		private readonly _Connection: Connection
	) {
		this.manager = this._Connection.manager;
		this.Helper = new SqlArticlesHelper(this.manager);
	}

	public async create(args: IAPOSTPart, user: IUser): Promise<IRPOSTPart> {
		const {} = args;
		const dataToSave: Omit<IPart, "_id" | "updatedAt" | "createdAt"> = {
			title: args.title,
			tags: await new PartTags(args, this._Connection).get(),
			author: user._id,
			barCode: args.barCode,
			description: args.description,
			images: args.images,
			manufacturerType: args.manufacturerType,
			modificationIds: args.modificationIds,
			oem: args.oem || "no oem",
			price: args.price,
			quantity: args.quantity,
			rating: 0,
			productId: args.productId,
			supplier: undefined,
		};

		if (1 < 2) return dataToSave as IRPOSTPart;

		const part = new this._PartModel(dataToSave);
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
