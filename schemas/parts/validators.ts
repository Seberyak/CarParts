import { IPart, PartSchema } from "./helper-schemas";
import Joi from "../../src/@input/joi";
import {
	ArgsManyIdSchema,
	IArgsManyId,
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

///---------------POST part

export const APOSTPartSchema = PartSchema.keys({
	...InsertStripKeysSchema,
	author: Joi.any().strip(),
	rating: Joi.any().strip(),
});

export type IAPOSTPart = Omit<IPart, toInsertKeys | "author" | "rating">;

export const RPOSTPartSchema = PartSchema;

export type IRPOSTPart = IPart;

///---------------GET part

export const AGETPartSchema = ArgsIdSchema;

export type IAGETPart = IArgsId;

export const RGETPartSchema = PartSchema;

export type IRGETPart = IPart;

///---------------GET many part by ids

export const AGETManyPartSchema = ArgsManyIdSchema.keys(APaginatedSchema);

export type IAGETManyPart = IArgsManyId & IAPaginated;

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
