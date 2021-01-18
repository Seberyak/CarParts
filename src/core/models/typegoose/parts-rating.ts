import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { IPartRating } from "../../../../schemas/parts-rating/helper-schemas";
import { IAGETManyPart } from "../../../../schemas/parts/validators";
import { IRPaginated } from "../../../../schemas/helper-schemas";
import { getManyDocsFunc } from "./abstract";

@modelOptions(getTypegooseOptions("parts-rating"))
export class PartRating implements Omit<IPartRating, "_id"> {
	@Prop()
	partId: IPartRating["partId"];

	@Prop()
	author: IPartRating["author"];

	@Prop()
	rate: IPartRating["rate"];

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;

	static async getMany(
		this: IPartRatingModel,
		args: IAGETManyPart
	): Promise<IRPaginated<IPartRating>> {
		return getManyDocsFunc<IPartRating>(args, this);
	}
}

export type IPartRatingModel = ReturnModelType<typeof PartRating>;
