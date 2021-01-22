import Joi from "../../../src/@input/joi";

///---------------POST image

export const APOSTImageSchema = Joi.any();

export type IAPOSTImage = any;

export const RPOSTImageSchema = Joi.object({
	message: Joi.string().required(),
	filename: Joi.string().required(),
});

export type IRPOSTImage = {
	message: string;
	filename: string;
};

///---------------POST many image

export const APOSTManyImageSchema = Joi.any();

export type IAPOSTManyImage = any;

export const RPOSTManyImageSchema = Joi.object({
	message: Joi.string().required(),
	data: Joi.array().items(Joi.object({ filename: Joi.string().required() })),
});

export type IRPOSTManyImage = {
	message: string;
	data: { filename: string }[];
};
