import { ObjectId } from "bson";
import Joi, { JoiSchema } from "../src/@input/joi";

export const BasicDocumentSchema = Joi.object({
	_id: Joi.objectId().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
});

export interface IBasicDocument {
	_id: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}
///

export const StripSchemaKeys = (
	schema: Record<string, any>,
	keys: string[]
) => {
	const stripSchema = {};
	keys.forEach(key => (stripSchema[key] = Joi.any().strip()));
	return schema.keys(stripSchema);
};

export const InsertStripKeysSchema = {
	_id: Joi.any().strip(),
	createdAt: Joi.any().strip(),
	updatedAt: Joi.any().strip(),
};

export type toInsertKeys = "_id" | "createdAt" | "updatedAt";

export const UpdateStripKeysSchema = {
	createdAt: Joi.any().strip(),
	updatedAt: Joi.any().strip(),
};

export type toUpdateKeys = "createdAt" | "updatedAt";

///

export const ArgsManyIdSchema = Joi.object({
	_ids: Joi.array()
		.items(Joi.objectId())
		.required(),
});

export interface IArgsManyId {
	_ids: ObjectId[];
}

///

export const APaginatedSchema = {
	from: Joi.number().required(),
	to: Joi.number().required(),
	_ids: Joi.array().items(Joi.objectId()),
};

export interface IAPaginated {
	from: number;
	to: number;
	_ids?: ObjectId[];
}

export const RPaginatedSchema = (TSchema: JoiSchema): JoiSchema =>
	Joi.object({
		numDocs: Joi.number().required(),
		docs: Joi.array()
			.items(TSchema)
			.required(),
	});

export interface IRPaginated<T> {
	numDocs: number;
	docs: T[];
}

////

export const ArgsIdSchema = Joi.object({ _id: Joi.objectId().required() });

export interface IArgsId {
	_id: ObjectId;
}
