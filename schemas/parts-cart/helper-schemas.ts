import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import { ObjectId } from "bson";
import Joi from "../../src/@input/joi";

export const PartCartSchema = BasicDocumentSchema.keys({
	partId: Joi.objectId().required(),
	author: Joi.objectId().required(),
});

export interface IPartCart extends IBasicDocument {
	partId: ObjectId;
	author: ObjectId;
}
