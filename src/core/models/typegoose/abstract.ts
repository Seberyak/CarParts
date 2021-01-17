import { IArgsManyId, IRPaginated } from "../../../../schemas/helper-schemas";
import { Model } from "mongoose";

export abstract class AbstractModel {
	createdAt: Date;

	updatedAt: Date;
}

export async function getManyDocsFunc<T>(
	args: IArgsManyId,
	model: Model<any>
): Promise<IRPaginated<T>> {
	const findPromise =
		args._ids.length > 0
			? model.find({ _id: { $in: args._ids } })
			: model.find();

	const [docs, numDocs] = await Promise.all([findPromise, model.count({})]);
	return { docs, numDocs };
}
