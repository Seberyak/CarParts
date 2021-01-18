import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { IPartRating, PartRatingSchema } from "./helper-schemas";
import {
	APaginatedSchema,
	ArgsManyIdSchema,
	IAPaginated,
	IArgsManyId,
	InsertStripKeysSchema,
	IRPaginated,
	RPaginatedSchema,
	toInsertKeys,
} from "../helper-schemas";

///---------------POST part rate

export const APOSTPartRatingSchema = PartRatingSchema.keys({
	author: Joi.any().strip(),
	...InsertStripKeysSchema,
});
export type IAPOSTPartRating = Omit<IPartRating, toInsertKeys | "author">;

export const RPOSTPartRatingSchema = PartRatingSchema;

export type IRPOSTPartRating = IPartRating;

///---------------GET part rate

export const AGETPartRatingSchema = Joi.object({
	partId: Joi.objectId().required(),
});

export interface IAGETPartRating {
	partId: ObjectId;
}

export const RGETPartRatingSchema = PartRatingSchema;

export type IRGETPartRating = IPartRating;

///---------------GET many part  rate #Admin

export const AGETManyPartRatingSchema = ArgsManyIdSchema.keys(APaginatedSchema);

export type IAGETManyPartRating = IArgsManyId & IAPaginated;

export const RGETManyPartRatingSchema = RPaginatedSchema(PartRatingSchema);

export type IRGETManyPartRating = IRPaginated<IPartRating>;

///---------------PUT part rate

export const APUTPartRatingSchema = APOSTPartRatingSchema;

export type IAPUTPartRating = IAPOSTPartRating;

export const RPUTPartRatingSchema = PartRatingSchema;

export type IRPUTPartRating = IPartRating;

///---------------DELETE part rate

export const ADELETEPartRatingSchema = Joi.object({
	partId: Joi.objectId().required(),
});

export interface IADELETEPartRating {
	partId: ObjectId;
}

export const RDELETEPartRatingSchema = Joi.any().strip();

export type IRDELETEPartRating = void;
