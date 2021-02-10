import { IPart } from "../../../../schemas/parts/helper-schemas";
import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { getManyDocsFunc } from "./abstract";
import { IRPaginated } from "../../../../schemas/helper-schemas";
import { IAGETManyPart } from "../../../../schemas/parts/validators";

//TODO index props...
@modelOptions(getTypegooseOptions("parts"))
export class Part implements Omit<IPart, "_id"> {
	@Prop()
	author: IPart["author"];

	@Prop()
	description: IPart["description"];

	@Prop()
	images: IPart["images"];

	@Prop()
	oem: IPart["oem"];

	@Prop()
	price: IPart["price"];

	@Prop()
	title: IPart["title"];

	@Prop()
	rating: IPart["rating"];

	@Prop()
	quantity: IPart["quantity"];

	@Prop()
	barCode: IPart["barCode"];

	@Prop()
	tags: string[];

	@Prop()
	manufacturerType: IPart["manufacturerType"];

	@Prop()
	modificationIds: IPart["modificationIds"];

	@Prop({ index: true })
	productId: IPart["productId"];

	@Prop()
	supplier: IPart["supplier"];

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;

	static async getMany(
		this: IPartModel,
		args: IAGETManyPart
	): Promise<IRPaginated<IPart>> {
		return getManyDocsFunc<IPart>(args, this);
	}
}

export type IPartModel = ReturnModelType<typeof Part>;
