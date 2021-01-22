///---------------POST Login

import Joi from "../../src/@input/joi";
import { IUser, UserSchema } from "../user/helper-schemas";
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
	access_token: Joi.string().required(),
});

export interface IRPOSTLogin {
	access_token: string;
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
