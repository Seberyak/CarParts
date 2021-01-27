import Joi from "../../src/@input/joi";

export enum ECarProducers {
	passenger = "passenger",
	commercial = "commercial",
	motorbike = "motorbike",
	engine = "engine",
	axle = "axle",
}

export const CarProducersSchema = Joi.string().valid(
	ECarProducers.axle,
	ECarProducers.commercial,
	ECarProducers.engine,
	ECarProducers.motorbike,
	ECarProducers.passenger
);

///---------------GET Car Producers

export const AGETCarProducersSchema = Joi.object({
	type: CarProducersSchema.required(),
});

export interface IAGETCarProducers {
	type: ECarProducers;
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
	type: CarProducersSchema.required(),
	pattern: Joi.string(),
	productionYear: Joi.number(),
});

export interface IAGETCarModels {
	producerId: number;
	type: ECarProducers;
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
	type: CarProducersSchema.required(),
	parentId: Joi.number(),
});
export interface IAGETPartCategories {
	modificationId: number;
	type: ECarProducers;
	parentId?: number;
}

export const RGETPartCategoriesSchema = Joi.array().items(PartCategoriesSchema);

export type IRGETPartCategories = IPartCategories[];

///---------------GET Section Parts

export const AGETSectionPartsSchema = Joi.object({
	modificationId: Joi.number().required(),
	type: CarProducersSchema.required(),
	sectionId: Joi.number().required(),
});

export interface IAGETSectionParts {
	modificationId: number;
	type: ECarProducers;
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
