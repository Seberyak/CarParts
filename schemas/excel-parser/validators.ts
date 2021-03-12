import Joi from "../../src/@input/joi";
import {
	CarManufacturersTypesSchema,
	ECarManufacturerTypes,
} from "../sql-articles/helper-schemas";

///---------------POST excel-parser

const ParsedDataFromExcelSchema = Joi.object({
	oem: Joi.string().required(),
	description: Joi.string().required(),
	imageName: Joi.string().required(),
	price: Joi.string().required(),
});

export interface IParsedDataFromExcel {
	oem: string;
	description: string;
	imageName: string;
	price: number;
}

export const APOPSTExcelParserSchema = Joi.object({
	type: CarManufacturersTypesSchema.required(),
});

export type IAPOPSTExcelParser = { type: ECarManufacturerTypes };

export const RPOPSTExcelParserSchema = Joi.array().items(
	ParsedDataFromExcelSchema
);

export type IRPOPSTExcelParser = IParsedDataFromExcel[];
