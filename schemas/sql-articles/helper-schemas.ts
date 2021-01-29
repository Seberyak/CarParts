import Joi from "../../src/@input/joi";

export enum ECarManufacturerTypes {
	passenger = "passenger",
	commercial = "commercial",
	motorbike = "motorbike",
	engine = "engine",
	axle = "axle",
}

export const CarManufacturersTypesSchema = Joi.string().valid(
	ECarManufacturerTypes.axle,
	ECarManufacturerTypes.commercial,
	ECarManufacturerTypes.engine,
	ECarManufacturerTypes.motorbike,
	ECarManufacturerTypes.passenger
);

export enum ELinkageTypes {
	passenger = 2,
	engine = 14,
	commercial = 16,
	axle = 19,
	motorbike = 777,
}
