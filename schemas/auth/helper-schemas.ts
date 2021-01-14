import Joi from "../../src/@input/joi";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";

export const UserSchema = BasicDocumentSchema.object({
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
});

export interface IUser extends IBasicDocument {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	mail: string;
	password: string;
}
