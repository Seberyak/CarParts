import {
	ArgsManyIdSchema,
	ArgsIdSchema,
	IArgsManyId,
	IArgsId,
	InsertStripKeysSchema,
	IResponseDocsByManyId,
	ResponseDocsByManyIdSchema,
	toInsertKeys,
} from "../helper-schemas";
import { IUser, UserSchema } from "./helper-schemas";
import Joi from "../../src/@input/joi";

///---------------POST user

export const APOSTUserSchema = UserSchema.keys(InsertStripKeysSchema);

export type IAPOSTUser = Omit<IUser, toInsertKeys>;

export const RPOSTUserSchema = UserSchema;

export type IRPOSTUser = IUser;

///---------------GET user

export const AGETUserSchema = ArgsIdSchema;

export type IAGETUser = IArgsId;

export const RGETUserSchema = UserSchema;

export type IRGETUser = IUser;

///---------------GET many user by ids

export const AGETManyUserSchema = ArgsManyIdSchema;

export type IAGETManyUser = IArgsManyId;

export const RGETManyUserSchema = ResponseDocsByManyIdSchema(UserSchema);

export type IRGETManyUser = IResponseDocsByManyId<IUser>;

///---------------PUT user

export const APUTUserSchema = UserSchema;

export type IAPUTUser = IUser;

export const RPUTUserSchema = UserSchema;

export type IRPUTUser = IUser;

///---------------DELETE user

export const ADELETEUserSchema = ArgsIdSchema;

export type IADELETEUser = IArgsId;

export const RDELETEUserSchema = Joi.any();

export type IRDELETEUser = unknown;