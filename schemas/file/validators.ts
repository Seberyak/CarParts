import Joi from "../../src/@input/joi";
import { ObjectId } from "bson";
import { FileInfoSchema, IFileInfo } from "./helper-schemas";

///---------------POST file

export const APOSTFileSchema = Joi.any();

export type IAPOSTFile = unknown;

export const RPOSTFileSchema = Joi.array().items(Joi.any());

export type IRPOSTFile = any[];

///---------------GET file info

export const AGETFileInfoSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export interface IAGETFileInfo {
	_id: ObjectId;
}

export const RGETFileInfoSchema = FileInfoSchema;

export type IRGETFileInfo = IFileInfo;

///---------------GET raw file

export const AGETRawFileSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export interface IAGETRawFile {
	_id: ObjectId;
}

export const RGETRawFileSchema = Joi.any();

export type IRGETRawFile = unknown;

///---------------GET download file

export const AGETDownloadFileSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export interface IAGETDownloadFile {
	_id: ObjectId;
}

export const RGETDownloadFileSchema = Joi.any();

export type IRGETDownloadFile = unknown;

///---------------DELETE file

export const ADELETEFileSchema = Joi.object({
	_id: Joi.objectId().required(),
});

export interface IADELETEFile {
	_id: ObjectId;
}

export const RGETDELETEFileSchema = FileInfoSchema;

export type IRGETDELETEFile = IFileInfo;
