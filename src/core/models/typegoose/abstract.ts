import { IAPaginated, IRPaginated } from "../../../../schemas/helper-schemas";
import { Model } from "mongoose";

export abstract class AbstractModel {
	createdAt: Date;

	updatedAt: Date;
}

export async function getManyDocsFunc<T>(
	args: IAPaginated,
	model: Model<any>,
	query = {}
): Promise<IRPaginated<T>> {
	const { _ids } = args;
	if (!!args._ids && args._ids.length > 0) {
		query = { _id: { $in: _ids } };
	}
	const [docs, numDocs] = await Promise.all([
		model
			.find(query)
			.sort({ createdAt: -1 })
			.skip(args.from)
			.limit(Math.max(args.to - args.from, 0)),
		model.countDocuments(query),
	]);

	return { docs, numDocs };
}
