import { BasicDocumentSchema } from "../helper-schemas";
import Joi from "../../src/@input/joi";

export const FileSchema = Joi.object({
	length: Joi.number().required(),
	chunkSize: Joi.number().required(),
	filename: Joi.string().required(),
	md5: Joi.string().required(),
	contentType: Joi.string().required(),
});

export interface IFile {
	length: number;
	chunkSize: number;
	filename: string;
	md5: string;
	contentType: string;
}

///

export const FileInfoSchema = Joi.object({
	message: Joi.string().required(),
	file: FileSchema,
});

export interface IFileInfo {
	message: string;
	file: IFile;
}
