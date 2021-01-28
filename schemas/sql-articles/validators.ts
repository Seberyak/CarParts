import Joi from "../../src/@input/joi";
import {
	CarProducersTypesSchema,
	ECarProducerTypes,
	ELinkageTypes,
} from "./helper-schemas";

///---------------GET Car Producers

export const AGETCarProducersSchema = Joi.object({
	type: CarProducersTypesSchema.required(),
});

export interface IAGETCarProducers {
	type: ECarProducerTypes;
}

export const RGETCarProducersSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().required(),
});

export interface IRGETCarProducers {
	id: number;
	name: number;
}

///---------------GET Car Models

export const AGETCarModelsSchema = Joi.object({
	producerId: Joi.number().required(),
	type: CarProducersTypesSchema.required(),
	pattern: Joi.string(),
	productionYear: Joi.number(),
});

export interface IAGETCarModels {
	producerId: number;
	type: ECarProducerTypes;
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
	type: CarProducersTypesSchema.required(),
	parentId: Joi.number(),
});
export interface IAGETPartCategories {
	modificationId: number;
	type: ECarProducerTypes;
	parentId?: number;
}

export const RGETPartCategoriesSchema = Joi.array().items(PartCategoriesSchema);

export type IRGETPartCategories = IPartCategories[];

///---------------GET Section Parts

export const AGETSectionPartsSchema = Joi.object({
	modificationId: Joi.number().required(),
	type: CarProducersTypesSchema.required(),
	sectionId: Joi.number().required(),
});

export interface IAGETSectionParts {
	modificationId: number;
	type: ECarProducerTypes;
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

export const AGETAutocompleteByOemSchema = Joi.object({
	oem: Joi.string().required(),
});

export interface IAGETAutocompleteByOem {
	oem: string;
}
