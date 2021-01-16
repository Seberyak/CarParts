import Joi from "../../src/@input/joi";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import { ObjectId } from "bson";

export const UserSchema = BasicDocumentSchema.keys({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	phoneNumber: Joi.string().required(),
	mail: Joi.string()
		.email()
		.required(),
	password: Joi.string()
		.min(8)
		.max(16)
		.required(),
	type: Joi.objectId().required(),
});

export interface IUser extends IBasicDocument {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	mail: string;
	password: string;
	type: ObjectId;
}
