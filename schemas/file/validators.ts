import Joi from "../../src/@input/joi";
import { FileInfoSchema, IFileInfo } from "./helper-schemas";
import { IArgsId } from "../helper-schemas";

///---------------POST file

export const APOSTFileSchema = Joi.any();

export type IAPOSTFile = unknown;

export const RPOSTFileSchema = Joi.array().items(Joi.any());

export type IRPOSTFile = any[];

///---------------GET file info

export const AGETFileInfoSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export type IAGETFileInfo = IArgsId;

export const RGETFileInfoSchema = FileInfoSchema;

export type IRGETFileInfo = IFileInfo;

///---------------GET raw file

export const AGETRawFileSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export type IAGETRawFile = IArgsId;

export const RGETRawFileSchema = Joi.any();

export type IRGETRawFile = unknown;

///---------------GET download file

export const AGETDownloadFileSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export type IAGETDownloadFile = IArgsId;

export const RGETDownloadFileSchema = Joi.any();

export type IRGETDownloadFile = unknown;

///---------------DELETE file

export const ADELETEFileSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export type IADELETEFile = IArgsId;

export const RGETDELETEFileSchema = FileInfoSchema;

export type IRGETDELETEFile = IFileInfo;
