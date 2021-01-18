import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import { ObjectId } from "bson";
import Joi from "../../src/@input/joi";

export const PartRatingSchema = BasicDocumentSchema.keys({
	partId: Joi.objectId().required(),
	rate: Joi.number()
		.min(0)
		.max(5)
		.required(),
	author: Joi.objectId().required(),
});

export interface IPartRating extends IBasicDocument {
	partId: ObjectId;
	rate: number;
	author: ObjectId;
}
