import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { IPartRating } from "../../../../schemas/parts-rating/helper-schemas";

@modelOptions(getTypegooseOptions("parts"))
export class PartRating implements Omit<IPartRating, "_id"> {
	@Prop({ unique: true })
	partId: IPartRating["partId"];

	@Prop()
	rates: IPartRating["rates"];

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export type IPartRatingModel = ReturnModelType<typeof PartRating>;
