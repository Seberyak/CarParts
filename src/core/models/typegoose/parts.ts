import { IPart } from "../../../../schemas/parts/helper-schemas";
import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { getManyDocsFunc } from "./abstract";
import { IRPaginated } from "../../../../schemas/helper-schemas";
import { IAGETManyPart } from "../../../../schemas/parts/validators";

@modelOptions(getTypegooseOptions("parts"))
export class Part implements Omit<IPart, "_id"> {
	@Prop()
	author: IPart["author"];

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
	updatedAt: Date;

	@Prop()
	rating: IPart["rating"];

	static async getMany(
		this: IPartModel,
		args: IAGETManyPart
	): Promise<IRPaginated<IPart>> {
		return getManyDocsFunc<IPart>(args, this);
	}
}

export type IPartModel = ReturnModelType<typeof Part>;
