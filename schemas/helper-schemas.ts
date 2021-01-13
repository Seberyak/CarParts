import { ObjectId } from "bson";
import Joi from "../src/@input/joi";

export const BasicDocumentSchema = Joi.object({
	_id: Joi.objectId().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
});

export interface IBasicDocument {
	_id: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}
