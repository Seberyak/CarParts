import { IPart } from "../../../../schemas/parts/helper-schemas";
import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";

@modelOptions(getTypegooseOptions("parts"))
export class Part implements Omit<IPart, "_id"> {
	@Prop()
	applicantId: IPart["applicantId"];

	@Prop()
	category: IPart["category"];

	@Prop()
	description: IPart["description"];

	@Prop()
	images: IPart["images"];

	@Prop()
	manufacturer: IPart["manufacturer"];

	@Prop()
	oem: IPart["oem"];

	@Prop()
	price: IPart["price"];

	@Prop()
	title: IPart["title"];

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: IPart["updatedAt"];
}

export type IPartModel = ReturnModelType<typeof Part>;
