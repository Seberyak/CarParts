import {
	APaginatedSchema,
	ArgsIdSchema,
	ArgsManyIdSchema,
	IAPaginated,
	IArgsId,
	IArgsManyId,
	IRPaginated,
	RPaginatedSchema,
	toUpdateKeys,
	UpdateStripKeysSchema,
} from "../helper-schemas";
import { IUser, UserSchema } from "./helper-schemas";
import Joi from "../../src/@input/joi";

///---------------GET user

export const AGETUserSchema = ArgsIdSchema;

export type IAGETUser = IArgsId;

export const RGETUserSchema = UserSchema;

export type IRGETUser = IUser;

///---------------GET many user by ids

export const AGETManyUserSchema = ArgsManyIdSchema.keys(APaginatedSchema);

export type IAGETManyUser = IArgsManyId & IAPaginated;

export const RGETManyUserSchema = RPaginatedSchema(UserSchema);

export type IRGETManyUser = IRPaginated<IUser>;

///---------------PUT user

export const APUTUserSchema = UserSchema.keys(UpdateStripKeysSchema);

export type IAPUTUser = Omit<IUser, toUpdateKeys>;

export const RPUTUserSchema = UserSchema;

export type IRPUTUser = IUser;

///---------------DELETE user

export const ADELETEUserSchema = ArgsIdSchema;

export type IADELETEUser = IArgsId;

export const RDELETEUserSchema = Joi.any();

export type IRDELETEUser = unknown;
