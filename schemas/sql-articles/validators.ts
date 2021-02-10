import Joi from "../../src/@input/joi";
import {
	CarManufacturersTypesSchema,
	ECarManufacturerTypes,
	ELinkageTypes,
} from "./helper-schemas";

///---------------GET Car Manufacturers

export const AGETCarManufacturersSchema = Joi.object({
	type: CarManufacturersTypesSchema.required(),
});

export interface IAGETCarManufacturers {
	type: ECarManufacturerTypes;
}

export const RGETCarManufacturersSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().required(),
});

export interface IRGETCarManufacturers {
	id: number;
	name: number;
}

///---------------GET Car Models

export const AGETCarModelsSchema = Joi.object({
	manufacturerId: Joi.number().required(),
	type: CarManufacturersTypesSchema.required(),
	pattern: Joi.string(),
	productionYear: Joi.number(),
});

export interface IAGETCarModels {
	manufacturerId: number;
	type: ECarManufacturerTypes;
	pattern?: string;
	productionYear?: number;
}

export const RGETCarModelsSchema = Joi.array().items(
	Joi.object({
		id: Joi.number().required(),
		name: Joi.string().required(),
		constructioninterval: Joi.string().required(),
	})
);

export type IRGETCarModels = {
	id: number;
	name: string;
	constructioninterval: string;
}[];

///---------------GET Car Modifications

export interface ICarModificationsQueryData {
	id: number;
	name: string;
	attributegroup: string;
	attributetype: string;
	displaytitle: string;
	displayvalue: string;
}

export const AGETCarModificationsSchema = Joi.object({
	modelId: Joi.number().required(),
	type: Joi.string().required(),
	productionYear: Joi.number(),
});

export interface IAGETCarModifications {
	modelId: number;
	type: string;
	productionYear: number;
}

export const RGETCarModificationsSchema = Joi.array().items(
	Joi.object({
		id: Joi.number().required(),
		name: Joi.string().required(),
		constructioninterval: Joi.string(),
	})
);

export type IRGETCarModifications = {
	id: number;
	name: string;
	constructioninterval: string;
}[];

///---------------GET Part Categories

export const PartCategoriesSchema = Joi.object({
	id: Joi.number().required(),
	description: Joi.string().required(),
});

export interface IPartCategories {
	id: number;
	description: string;
}

export const AGETPartCategoriesSchema = Joi.object({
	modificationId: Joi.number().required(),
	type: CarManufacturersTypesSchema.required(),
	parentId: Joi.number(),
});
export interface IAGETPartCategories {
	modificationId: number;
	type: ECarManufacturerTypes;
	parentId?: number;
}

export const RGETPartCategoriesSchema = Joi.array().items(PartCategoriesSchema);

export type IRGETPartCategories = IPartCategories[];

///---------------GET Section Parts

export const AGETPartsByProductIdSchema = Joi.object({
	modificationId: Joi.number().required(),
	type: CarManufacturersTypesSchema.required(),
	productId: Joi.number().required(),
});

export interface IAGETPartsByProductId {
	modificationId: number;
	type: ECarManufacturerTypes;
	productId: number;
}

export const RGETPartsByProductIdSchema = Joi.object({
	partNumber: Joi.string().required(),
	supplierName: Joi.string().required(),
	productName: Joi.string().required(),
});

export interface IRGETPartsByProductId {
	partNumber: string;
	supplierName: string;
	productName: string;
}

///---------------GET Autocomplete by OEM

export interface IArticleLinks {
	supplierid: number;
	productid: number;
	linkagetypeid: ELinkageTypes;
	linkageid: number;
	datasupplierarticlenumber: string;
}

export interface IGroupByLinkageType {
	passenger: IArticleLinks[];
	commercial: IArticleLinks[];
	motorbike: IArticleLinks[];
	engine: IArticleLinks[];
	axle: IArticleLinks[];
}

export interface ICarsTreeRawElement {
	manufacturerId: number;
	manufacturer: string;
	modelId: number;
	model: string;
	modificationId: number;
	modification: string;
	constructioninterval: string;
}

export type ICarsTreeRawData = ICarsTreeRawElement[];

export type ICarsTreeManufacturerLevel = Record<string, ICarsTreeModelLevel>;

export type ICarsTreeModelLevel = string[];

export type ICarsTreeModificationLevel = string;

export type IRCarsTree = Record<string, ICarsTreeManufacturerLevel>;

export const AGETAutocompleteByOemSchema = Joi.object({
	oem: Joi.string().required(),
	type: CarManufacturersTypesSchema.required(),
});

export interface IAGETAutocompleteByOem {
	oem: string;
	type: ECarManufacturerTypes;
}

///---------------GET Products By Node

export const AGETProductsByNodeSchema = Joi.object({
	modificationId: Joi.number().required(),
	nodeId: Joi.number().required(),
	type: CarManufacturersTypesSchema.required(),
});

export interface IAGETProductsByNode {
	modificationId: number;
	nodeId: number;
	type: ECarManufacturerTypes;
}
export const RGETProductsByNodeSchema = Joi.array().items(
	Joi.object({
		nodeId: Joi.number().required(),
		productId: Joi.number().required(),
		description: Joi.string().required(),
	})
);

export type IRGETProductsByNode = {
	nodeId: number;
	productId: number;
	description: string;
}[];
