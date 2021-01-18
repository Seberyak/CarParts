import {
	IAPaginated,
	IArgsManyId,
	IRPaginated,
} from "../../../../schemas/helper-schemas";
import { Model } from "mongoose";

export abstract class AbstractModel {
	createdAt: Date;

	updatedAt: Date;
}

export async function getManyDocsFunc<T>(
	args: IArgsManyId & IAPaginated,
	model: Model<any>
): Promise<IRPaginated<T>> {
	const queryParams = args._ids.length > 0 ? { _id: { $in: args._ids } } : {};

	const [docs, numDocs] = await Promise.all([
		model
			.find(queryParams)
			.sort({ createdAt: -1 })
			.skip(args.from)
			.limit(Math.max(args.to - args.from, 0)),
		model.count({}),
	]);

	return { docs, numDocs };
}
