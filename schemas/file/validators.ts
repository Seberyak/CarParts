import Joi from "../../src/@input/joi";
import { FileInfoSchema, IFileInfo } from "./helper-schemas";
import { IArgsId } from "../helper-schemas";
import { ObjectId } from "bson";

///---------------POST file

export const APOSTFileSchema = Joi.any();

export type IAPOSTFile = unknown;

export const RPOSTFileSchema = Joi.array().items(
	Joi.object({
		originalname: Joi.string().required(),
		encoding: Joi.string().required(),
		mimetype: Joi.string().required(),
		id: Joi.objectId().required(),
		filename: Joi.string().required(),
		metadata: Joi.any().required(),
		bucketName: Joi.string().required(),
		chunkSize: Joi.number().required(),
		size: Joi.number().required(),
		md5: Joi.string().required(),
		uploadDate: Joi.date().required(),
		contentType: Joi.string().required(),
	})
);

export type IRPOSTFile = {
	originalname: string;
	encoding: string;
	mimetype: string;
	id: ObjectId;
	filename: string;
	metadata: any;
	bucketName: string;
	chunkSize: number;
	size: number;
	md5: string;
	uploadDate: Date;
	contentType: string;
}[];

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
