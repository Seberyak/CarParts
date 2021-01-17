import { IPart } from "../../../../schemas/parts/helper-schemas";
import { modelOptions, Prop, ReturnModelType } from "@typegoose/typegoose";
import { getTypegooseOptions } from "../../utils/db-config";
import { AbstractModel } from "./abstract";
import { IRPaginated } from "../../../../schemas/helper-schemas";
import { IAGETManyPart } from "../../../../schemas/parts/validators";

@modelOptions(getTypegooseOptions("parts"))
export class Part implements Omit<IPart, "_id">, AbstractModel {
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

	static async getMany(
		this: IPartModel,
		args: IAGETManyPart
	): Promise<IRPaginated<IPart>> {
		const queryParams =
			args._ids.length > 0 ? { _id: { $in: args._ids } } : {};

		const [docs, numDocs] = await Promise.all([
			this.find(queryParams)
				.sort({ createdAt: -1 })
				.skip(args.from)
				.limit(Math.max(args.to - args.from, 0)),
			this.count({}),
		]);

		return { docs, numDocs };
	}
}

export type IPartModel = ReturnModelType<typeof Part>;
