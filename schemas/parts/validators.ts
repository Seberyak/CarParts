import { IPart, PartSchema } from "./helper-schemas";
import Joi from "../../src/@input/joi";
import {
	ArgsManyIdSchema,
	IArgsManyId,
	ArgsIdSchema,
	InsertStripKeysSchema,
	IResponseDocsByManyId,
	ResponseDocsByManyIdSchema,
	toInsertKeys,
	IArgsId,
} from "../helper-schemas";

///---------------POST part

export const APOSTPartSchema = PartSchema.keys({
	...InsertStripKeysSchema,
	author: Joi.any().strip(),
});

export type IAPOSTPart = Omit<IPart, toInsertKeys | "author">;

export const RPOSTPartSchema = PartSchema;

export type IRPOSTPart = IPart;

///---------------GET part

export const AGETPartSchema = ArgsIdSchema;

export type IAGETPart = IArgsId;

export const RGETPartSchema = PartSchema;

export type IRGETPart = IPart;

///---------------GET many part by ids

export const AGETManyPartSchema = ArgsManyIdSchema;

export type IAGETManyPart = IArgsManyId;

export const RGETManyPartSchema = ResponseDocsByManyIdSchema(PartSchema);

export type IRGETManyPart = IResponseDocsByManyId<IPart>;

///---------------PUT part

export const APUTPartSchema = PartSchema;

export type IAPUTPart = IPart;

export const RPUTPartSchema = PartSchema;

export type IRPUTPart = IPart;

///---------------DELETE part

export const ADELETEPartSchema = ArgsIdSchema;

export type IADELETEPart = IArgsId;

export const RDELETEPartSchema = Joi.any();

export type IRDELETEPart = unknown;
