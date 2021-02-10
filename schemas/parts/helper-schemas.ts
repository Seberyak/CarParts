import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import {
	CarManufacturersTypesSchema,
	ECarManufacturerTypes,
} from "../sql-articles/helper-schemas";

export const PartSchema = BasicDocumentSchema.keys({
	title: Joi.string().required(),
	description: Joi.string()
		.allow("", null)
		.required(),
	author: Joi.objectId().required(),
	price: Joi.number().required(),
	oem: Joi.string().required(),
	images: Joi.array()
		.items(Joi.string())
		.max(10)
		.required(),
	quantity: Joi.number()
		.min(1)
		.required(),
	rating: Joi.number().required(),
	tags: Joi.array()
		.items(Joi.string())
		.required(),
	modificationIds: Joi.array()
		.items(Joi.number())
		.min(1)
		.required(),
	barCode: Joi.string(),
	manufacturerType: CarManufacturersTypesSchema,
	productId: Joi.number(),
	supplier: Joi.object({
		id: Joi.number().required(),
		name: Joi.string().required(),
	}),
});

export interface IPart extends IBasicDocument {
	title: string;
	description: string | null;
	author: ObjectId;
	price: number;
	oem: string;
	images: string[];
	quantity: number;
	rating: number;
	tags: string[];
	modificationIds: number[];
	barCode: string | undefined;
	manufacturerType: ECarManufacturerTypes;
	productId: number | undefined;
	supplier: { id: number; name: string } | undefined;
}
