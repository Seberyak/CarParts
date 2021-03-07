import { IPartCart, PartCartSchema } from "./helper-schemas";
import {
	APaginatedSchema,
	IAPaginated,
	InsertStripKeysSchema,
	IRPaginated,
	RPaginatedSchema,
	toInsertKeys,
} from "../helper-schemas";
import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";

///---------------GET parts from cart

export const AGETPartsCartSchema = Joi.object(APaginatedSchema);

export type IAGETPartsCart = IAPaginated;

export const RGETPartsCartSchema = RPaginatedSchema(PartCartSchema);

export type IRGETPartsCart = IRPaginated<IPartCart>;

///---------------POST parts to cart

export const APOSTPartCartSchema = PartCartSchema.keys({
	...InsertStripKeysSchema,
	author: Joi.any().strip(),
});

export type IAPOSTPartCart = Omit<IPartCart, toInsertKeys | "author">;

export const RPOSTPartCartSchema = PartCartSchema;

export type IRPOSTPartCart = IPartCart;

///---------------POST parts to cart

export const ADELETEPartCartSchema = Joi.object({
	_id: Joi.objectId().required(),
});
export interface IADELETEPartCart {
	_id: ObjectId;
}

export const RDELETEPartCartSchema = Joi.any();

export type IRDELETEPartCart = void;
