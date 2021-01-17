import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import { ObjectId } from "bson";
import Joi from "../../src/@input/joi";

export const UserPartRateSchema = Joi.object({
	value: Joi.number().required(),
	author: Joi.objectId().required(),
});

export interface IUserPartRate {
	value: number;
	author: ObjectId;
}

export const PartRatingSchema = BasicDocumentSchema.keys({
	partId: Joi.objectId().required(),
	rates: UserPartRateSchema,
});

export interface IPartRating extends IBasicDocument {
	partId: ObjectId;
	rates: IUserPartRate[];
}
