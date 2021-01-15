import { IPart } from "../../../../schemas/parts/helper-schemas";
import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { AbstractModel, getManyDocsFunc } from "./abstract";
import {
	IArgsManyId,
	IResponseDocsByManyId,
} from "../../../../schemas/helper-schemas";

@modelOptions(getTypegooseOptions("parts"))
export class Part implements Omit<IPart, "_id">, AbstractModel {
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

	static getManyDocs(
		this: IPartModel,
		args: IArgsManyId
	): Promise<IResponseDocsByManyId<IPart>> {
		return getManyDocsFunc(args, this);
	}
}

export type IPartModel = ReturnModelType<typeof Part>;
