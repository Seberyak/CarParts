///---------------POST Login

import Joi from "../../src/@input/joi";
import {
	FirebaseMetadataSchema,
	IFirebaseMetadata,
	IUser,
	UserSchema,
} from "../user/helper-schemas";
import { InsertStripKeysSchema, toInsertKeys } from "../helper-schemas";
import { ObjectId } from "bson";

export const APOSTLoginSchema = Joi.object({
	mail: Joi.string()
		.email()
		.required(),
	password: Joi.string().required(),
});

export interface IAPOSTLogin {
	mail: string;
	password: string;
}

export const RPOSTLoginSchema = Joi.object({
	"access-token": Joi.string().required(),
});

export interface IRPOSTLogin {
	"access-token": string;
}

///---------------POST user

export const APOSTUserSchema = UserSchema.keys({
	...InsertStripKeysSchema,
	type: Joi.objectId().optional(),
});

export interface IAPOSTUser extends Omit<IUser, toInsertKeys | "type"> {
	type?: ObjectId;
}

export const RPOSTUserSchema = UserSchema;

export type IRPOSTUser = IUser;

///---------------POST firebase-login

export const APOSTFirebaseLoginSchema = FirebaseMetadataSchema;

export type IAPOSTFirebaseLogin = IFirebaseMetadata;

export const RPOSTFirebaseLoginUserSchema = RPOSTLoginSchema;

export type IRPOSTFirebaseLogin = IRPOSTLogin;
