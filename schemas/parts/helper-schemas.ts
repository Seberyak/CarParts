import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";

export const PartSchema = BasicDocumentSchema.keys({
	title: Joi.string().required(),
	description: Joi.string().required(),
	author: Joi.objectId().required(),
	price: Joi.number().required(),
	oem: Joi.string().required(),
	manufacturer: Joi.string(),
	category: Joi.string().required(),
	images: Joi.array()
		.items(Joi.objectId())
		.required(),
	rating: Joi.number().required(),
});

export interface IPart extends IBasicDocument {
	title: string;
	description: string;
	author: ObjectId;
	price: number;
	oem: string;
	manufacturer?: string;
	category: string;
	images: ObjectId[];
	rating: number;
}
