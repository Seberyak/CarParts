import Joi from "../../src/@input/joi";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import { ObjectId } from "bson";

const PasswordRegex = new RegExp(
	`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$`
);

export const UserSchema = BasicDocumentSchema.keys({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	phoneNumber: Joi.string().required(),
	mail: Joi.string()
		.email()
		.required(),
	password: Joi.string()
		.regex(PasswordRegex)
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
