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
