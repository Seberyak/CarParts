import { IAPaginated, IRPaginated } from "../../../../schemas/helper-schemas";
import { Model } from "mongoose";

export abstract class AbstractModel {
	createdAt: Date;

	updatedAt: Date;
}

export async function getManyDocsFunc<T>(
	args: IAPaginated,
	model: Model<any>
): Promise<IRPaginated<T>> {
	const [docs, numDocs] = await Promise.all([
		model
			.find()
			.sort({ createdAt: -1 })
			.skip(args.from)
			.limit(Math.max(args.to - args.from, 0)),
		model.countDocuments(),
	]);

	return { docs, numDocs };
}
