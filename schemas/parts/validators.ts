import { IPart, PartSchema } from "./helper-schemas";
import Joi from "../../src/@input/joi";
import {
	ArgsIdSchema,
	InsertStripKeysSchema,
	IRPaginated,
	RPaginatedSchema,
	toInsertKeys,
	IArgsId,
	APaginatedSchema,
	IAPaginated,
	toUpdateKeys,
	UpdateStripKeysSchema,
} from "../helper-schemas";
import { CarManufacturersTypesSchema } from "../sql-articles/helper-schemas";

///---------------POST part

export const APOSTPartSchema = PartSchema.keys({
	...InsertStripKeysSchema,
	oem: Joi.string().optional(),
	author: Joi.any().strip(),
	rating: Joi.any().strip(),
	tags: Joi.array()
		.items(Joi.string())
		.optional(),
});

export interface IAPOSTPart
	extends Omit<IPart, toInsertKeys | "author" | "rating" | "tags" | "oem"> {
	oem: string | undefined;
	tags: string[] | undefined;
}

export const RPOSTPartSchema = PartSchema;

export type IRPOSTPart = IPart;

///---------------GET part

export const AGETPartSchema = ArgsIdSchema;

export type IAGETPart = IArgsId;

export const RGETPartSchema = PartSchema;

export type IRGETPart = IPart;

///---------------GET many part by ids

export const AGETManyPartSchema = Joi.object().keys(APaginatedSchema);

export type IAGETManyPart = IAPaginated;

export const RGETManyPartSchema = RPaginatedSchema(PartSchema);

export type IRGETManyPart = IRPaginated<IPart>;

///---------------PUT part

export const APUTPartSchema = PartSchema.keys({
	...UpdateStripKeysSchema,
	rating: Joi.any().strip(),
});

export type IAPUTPart = Omit<IPart, toUpdateKeys | "rating">;

export const RPUTPartSchema = PartSchema;

export type IRPUTPart = IPart;

///---------------DELETE part

export const ADELETEPartSchema = ArgsIdSchema;

export type IADELETEPart = IArgsId;

export const RDELETEPartSchema = Joi.any();

export type IRDELETEPart = unknown;

///---------------GET Search part

export const AGETSearchPartsSchema = Joi.object({
	manufacturerType: CarManufacturersTypesSchema,
	modificationIds: Joi.array().items(Joi.number()),
	productId: Joi.number(),
	barCode: Joi.string(),
	price: Joi.object({
		min: Joi.number()
			.min(0)
			.required(),
		max: Joi.number()
			.min(0)
			.required(),
	}),
	searchableText: Joi.string(),
});

export interface IAGETSearchParts {
	manufacturerType?: IPart["manufacturerType"];
	modificationIds?: IPart["modificationIds"];
	productId?: IPart["productId"];
	barCode?: IPart["barCode"];
	price?: { min: number; max: number };
	searchableText?: string;
}

export const RGETSearchPartsSchema = RGETManyPartSchema;

export type IRGETSearchParts = IRGETManyPart;
