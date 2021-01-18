import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import {
	IPartRatingModel,
	PartRating,
} from "../../models/typegoose/parts-rating";
import {
	IADELETEPartRating,
	IAGETManyPartRating,
	IAGETPartRating,
	IAPOSTPartRating,
	IAPUTPartRating,
	IRDELETEPartRating,
	IRGETManyPartRating,
	IRGETPartRating,
	IRPOSTPartRating,
	IRPUTPartRating,
} from "../../../../schemas/parts-rating/validators";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { docToObj } from "../../utils/db-config";
import { IPartModel, Part } from "../../models/typegoose/parts";
import { MError } from "../../utils/errors";
import { assertResourceExist } from "../../utils/asserts";
import { ObjectId } from "bson";

@Injectable()
export class PartsRatingService {
	constructor(
		@InjectModel(PartRating)
		private readonly _PartRatingModel: IPartRatingModel,

		@InjectModel(Part)
		private readonly _PartModel: IPartModel
	) {}

	public async create(
		args: IAPOSTPartRating,
		user: IUser
	): Promise<IRPOSTPartRating> {
		let partRating = await this._PartRatingModel.findOne({
			partId: args.partId,
			author: user._id,
		});

		if (!!partRating) {
			throw new MError(403, "User has already rated this part");
		}
		partRating = new this._PartRatingModel({
			partId: args.partId,
			author: user._id,
			rate: args.rate,
		});
		await partRating.save();
		await this.recalculatePartRating(args.partId);
		return docToObj(partRating);
	}

	async get(args: IAGETPartRating, user: IUser): Promise<IRGETPartRating> {
		const partRating = await this._PartRatingModel.findOne({
			partId: args.partId,
			author: user._id,
		});
		assertResourceExist(partRating, "partRating");
		return docToObj(partRating);
	}

	async getMany(args: IAGETManyPartRating): Promise<IRGETManyPartRating> {
		return this._PartRatingModel.getMany(args);
	}

	async update(args: IAPUTPartRating, user: IUser): Promise<IRPUTPartRating> {
		const partRating = await this._PartRatingModel.findOneAndUpdate(
			{ partId: args.partId, author: user._id },
			{ rate: args.rate },
			{ new: true }
		);
		assertResourceExist(partRating, "partRating");
		await this.recalculatePartRating(args.partId);
		return docToObj(partRating);
	}

	async delete(
		args: IADELETEPartRating,
		user: IUser
	): Promise<IRDELETEPartRating> {
		const partRating = await this._PartRatingModel.findOneAndDelete({
			partId: args.partId,
			author: user._id,
		});
		assertResourceExist(partRating, "partRating");

		await this.recalculatePartRating(args.partId);
	}

	private async recalculatePartRating(partId: ObjectId): Promise<void> {
		const [partRatings, part] = await Promise.all([
			this._PartRatingModel.find({ partId }),
			this._PartModel.findById(partId),
		]);
		if (partRatings.length === 0) part.rating = 0;
		else {
			let sumRatingValues = 0;
			partRatings.forEach(el => (sumRatingValues += el.rate));
			part.rating = sumRatingValues / partRatings.length;
		}
		await part.save();
	}
}
