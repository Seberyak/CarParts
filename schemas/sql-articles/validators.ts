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

export const AGETSectionPartsSchema = Joi.object({
	modificationId: Joi.number().required(),
	type: CarManufacturersTypesSchema.required(),
	sectionId: Joi.number().required(),
});

export interface IAGETSectionParts {
	modificationId: number;
	type: ECarManufacturerTypes;
	sectionId: number;
}

export const RGETSectionPartsSchema = Joi.object({
	part_number: Joi.string().required(),
	supplier_name: Joi.string().required(),
	product_name: Joi.string().required(),
});

export interface IRGETSectionParts {
	part_number: string;
	supplier_name: string;
	product_name: string;
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

export type ICarsTreeModelLevel = Record<string, ICarsTreeModificationLevel>;

export type ICarsTreeModificationLevel = {
	constructioninterval: string;
};

export type IRCarsTree = Record<string, ICarsTreeManufacturerLevel>;

export const AGETAutocompleteByOemSchema = Joi.object({
	oem: Joi.string().required(),
});

export interface IAGETAutocompleteByOem {
	oem: string;
}
