import Joi from "../../src/@input/joi";

export enum ECarProducerTypes {
	passenger = "passenger",
	commercial = "commercial",
	motorbike = "motorbike",
	engine = "engine",
	axle = "axle",
}

export const CarProducersTypesSchema = Joi.string().valid(
	ECarProducerTypes.axle,
	ECarProducerTypes.commercial,
	ECarProducerTypes.engine,
	ECarProducerTypes.motorbike,
	ECarProducerTypes.passenger
);

export enum ELinkageTypes {
	passenger = 2,
	engine = 14,
	commercial = 16,
	axle = 19,
	motorbike = 777,
}
