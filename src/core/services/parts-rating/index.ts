import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import {
	IPartRatingModel,
	PartRating,
} from "../../models/typegoose/parts-rating";
import {
	IADELETEPartRating,
	IAGETPartRating,
	IAPOSTPartRating,
	IAPUTPartRating,
	IRDELETEPartRating,
	IRGETPartRating,
	IRPOSTPartRating,
	IRPUTPartRating,
} from "../../../../schemas/parts-rating/validators";
import { IUser } from "../../../../schemas/user/helper-schemas";
import { docToObj } from "../../utils/db-config";
import { IPartRating } from "../../../../schemas/parts-rating/helper-schemas";
import { IPartModel, Part } from "../../models/typegoose/parts";
import { MError } from "../../utils/errors";
import { assertResourceExist } from "../../utils/asserts";
import { DocumentType } from "@typegoose/typegoose/lib/types";

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
		let partRating = await this.getPartRatingDoc(args);

		if (!partRating) {
			partRating = new this._PartRatingModel({
				partId: args.partId,
				rates: [],
			});
		}
		if (partRating.rates.find(el => el.author.equals(user._id))) {
			throw new MError(403, "User has already rated this part");
		}
		const userPartRate = { author: user._id, value: args.value };
		partRating.rates.push(userPartRate);

		await Promise.all([
			partRating.save(),
			this.recalculatePartRating(docToObj(partRating)),
		]);
		return userPartRate;
	}

	async get(args: IAGETPartRating, user: IUser): Promise<IRGETPartRating> {
		const partRating = await this._PartRatingModel.findOne({
			partId: args.partId,
		});
		assertResourceExist(partRating, "partRating");
		const userRatedRecord = partRating.rates.find(el =>
			el.author.equals(user._id)
		);
		assertResourceExist(userRatedRecord, "userPartRate");
		return userRatedRecord;
	}

	async update(args: IAPUTPartRating, user: IUser): Promise<IRPUTPartRating> {
		const partRating = await this.getPartRatingDoc({ partId: args.partId });

		assertResourceExist(partRating, "partRating");
		const userRatedRecord = partRating.rates.find(el =>
			el.author.equals(user._id)
		);
		assertResourceExist(userRatedRecord, "userPartRate");
		userRatedRecord.value = args.value;

		partRating.markModified("rates");
		await Promise.all([
			partRating.save(),
			this.recalculatePartRating(partRating),
		]);

		return userRatedRecord;
	}

	async delete(
		args: IADELETEPartRating,
		user: IUser
	): Promise<IRDELETEPartRating> {
		const partRating = await this._PartRatingModel.findOne({
			partId: args.partId,
		});
		assertResourceExist(partRating, "partRating");

		const userRatedRecord = partRating.rates.find(el =>
			el.author.equals(user._id)
		);
		assertResourceExist(userRatedRecord, "userPartRate");

		partRating.rates = partRating.rates.filter(
			el => !el.author.equals(user._id)
		);

		partRating.markModified("rates");

		await Promise.all([
			this.recalculatePartRating(partRating),
			partRating.save(),
		]);
	}

	private async recalculatePartRating(args: IPartRating): Promise<void> {
		let sumRatingValues = 0;
		args.rates.forEach(el => (sumRatingValues += el.value));
		const finalRate = sumRatingValues / args.rates.length;
		await this._PartModel.findOneAndUpdate(
			{ _id: args.partId },
			{ rating: finalRate }
		);
	}

	private async getPartRatingDoc(
		args: IAGETPartRating
	): Promise<DocumentType<PartRating>> {
		const [part, partRating] = await Promise.all([
			this._PartModel.findOne({ _id: args.partId }),
			this._PartRatingModel.findOne({
				partId: args.partId,
			}),
		]);

		assertResourceExist(part, "part");
		return partRating;
	}
}
