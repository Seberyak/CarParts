import Joi from "../../src/@input/joi";
import { BasicDocumentSchema, IBasicDocument } from "../helper-schemas";
import { ObjectId } from "bson";

const PasswordRegex = new RegExp(
	`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$`
);

export const FirebaseMetadataSchema = Joi.object({
	uid: Joi.string().required(),
	displayName: Joi.string()
		.allow(null)
		.required(),
	email: Joi.string()
		.email()
		.allow(null)
		.required(),
	phoneNumber: Joi.string().required(),
});

export interface IFirebaseMetadata {
	uid: string;
	displayName: string | null;
	email: string | null;
	phoneNumber: string;
}

export const UserSchema = BasicDocumentSchema.keys({
	firstName: Joi.string()
		.allow(null)
		.required(),
	lastName: Joi.string()
		.allow(null)
		.required(),
	phoneNumber: Joi.string().required(),
	email: Joi.string()
		.email()
		.allow(null)
		.required(),
	password: Joi.string()
		.regex(PasswordRegex)
		.allow(null)
		.required(),
	type: Joi.objectId().required(),
	firebaseMetadata: FirebaseMetadataSchema.allow(null),
});

export interface IUser extends IBasicDocument {
	firstName: string | null;
	lastName: string | null;
	phoneNumber: string;
	email: string | null;
	password: string | null;
	type: ObjectId;
	firebaseMetadata: IFirebaseMetadata | null;
}
