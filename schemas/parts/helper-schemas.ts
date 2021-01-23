import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";

export const PartSchema = BasicDocumentSchema.keys({
	title: Joi.string().required(),
	description: Joi.string(),
	author: Joi.objectId().required(),
	price: Joi.number().required(),
	oem: Joi.string().required(),
	manufacturer: Joi.string(),
	category: Joi.string(),
	images: Joi.array()
		.items(Joi.string())
		.max(10)
		.required(),
	quantity: Joi.number()
		.min(1)
		.required(),
	rating: Joi.number().required(),
	barCode: Joi.string(),
});

export interface IPart extends IBasicDocument {
	title: string;
	description?: string;
	author: ObjectId;
	price: number;
	oem: string;
	manufacturer?: string;
	category?: string;
	images: string[];
	quantity: number;
	rating: number;
	barCode?: string;
}
