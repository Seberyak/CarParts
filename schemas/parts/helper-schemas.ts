import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";

export const PartSchema = BasicDocumentSchema.keys({
	applicantId: Joi.objectId().required(),
	title: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	oem: Joi.string().required(),
	manufacturer: Joi.string().required(),
	category: Joi.string().required(),
	images: Joi.array()
		.items(Joi.objectId())
		.required(),
});

export interface IPart extends IBasicDocument {
	applicantId: ObjectId;
	title: string;
	description: string;
	price: number;
	oem: string;
	manufacturer: string;
	category: string;
	images: ObjectId[];
}
