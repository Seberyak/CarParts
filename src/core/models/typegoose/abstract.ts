import {
	IArgsManyId,
	IResponseDocsByManyId,
} from "../../../../schemas/helper-schemas";
import { Model } from "mongoose";

export abstract class AbstractModel {
	createdAt: Date;

	updatedAt: Date;
}

export async function getManyDocsFunc<T>(
	args: IArgsManyId,
	model: Model<any>
): Promise<IResponseDocsByManyId<T>> {
	const [docs, numDocs] = await Promise.all([
		model.find(args),
		model.count({}),
	]);
	return { docs, numDocs };
}
