import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { IPartCart } from "../../../../schemas/parts-cart/helper-schemas";

@modelOptions(getTypegooseOptions("parts-cart"))
export class PartCart implements Omit<IPartCart, "_id"> {
	@Prop({ index: true })
	author: IPartCart["author"];

	@Prop({ index: true })
	partId: IPartCart["partId"];

	@Prop()
	createdAt: IPartCart["createdAt"];

	@Prop()
	updatedAt: IPartCart["updatedAt"];
}

export type IPartCartModel = ReturnModelType<typeof PartCart>;
