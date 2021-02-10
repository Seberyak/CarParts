import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import {
	CarManufacturersTypesSchema,
	ECarManufacturerTypes,
} from "../sql-articles/helper-schemas";

export const PartSchema = BasicDocumentSchema.keys({
	title: Joi.string().required(),
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
	manufacturerType: CarManufacturersTypesSchema,
	productId: Joi.number().required(),
	barCode: Joi.string(),
	description: Joi.string().allow(""),
	supplier: Joi.object({
		id: Joi.number().required(),
		name: Joi.string().required(),
	}),
});

export interface IPart extends IBasicDocument {
	title: string;
	author: ObjectId;
	price: number;
	oem: string;
	images: string[];
	quantity: number;
	rating: number;
	tags: string[];
	modificationIds: number[];
	manufacturerType: ECarManufacturerTypes;
	productId: number;
	barCode: string | undefined;
	description: string | undefined;
	supplier: { id: number; name: string } | undefined;
}
